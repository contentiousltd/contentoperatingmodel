#!/usr/bin/env python3
"""PreToolUse(Edit|Write|MultiEdit) design gate – refuse UI edits until the design
system has actually been consulted.

The failure this exists to stop: an agent writes UI without reading the design system,
invents a colour/spacing/layout/component that looks plausible to it, and the result is
off-brand work that costs hours to unpick. Instructions in CLAUDE.md did not prevent
this – they are read once, describe files in another folder, and lose to the path of
least resistance at the moment a <div> is being written.

So consultation stops being a matter of inclination. The first edit to a UI file in any
session is denied with instructions to invoke the `contentious-design` skill. Once that
skill has been invoked, every subsequent UI edit passes silently.

Deny is expressed as PreToolUse hookSpecificOutput.permissionDecision so the reason is
shown to the agent. Any internal error → exit 0, so the hook can never wedge tooling.
"""
import json
import os
import re
import sys

SKILL = "contentious-design"

# UI files this gate covers. Server code, tests, config and docs are unaffected.
UI_PATH = re.compile(r"/src/.*\.(astro|tsx|jsx|css)$")

DENIAL = f"""Design gate: invoke the `{SKILL}` skill before editing UI.

This file is UI, and the design system has not been consulted in this session.
Run the skill, read its readme.md, then read the `<Name>.prompt.md` beside any
component you are about to touch. This edit will pass once the skill is invoked.

While you are in there, the standing rule:

  NEVER originate a visual decision. Not a colour, not a spacing value, not a
  layout, not a component that doesn't exist, not a "reasonable placeholder".
  Design is originated by Julius or by Claude Design. You implement to spec.

  If the system doesn't answer it, say so and stop. An unstyled element or an
  unfinished screen is always the better outcome than invented design. It is not
  a gap if you haven't looked – the foundations almost always answer the question.
"""


def is_ui_file(path: str) -> bool:
    if not path:
        return False
    return bool(UI_PATH.search(path.replace(os.sep, "/")))


def skill_was_invoked(transcript_path: str) -> bool:
    """True if the design skill was invoked anywhere in this session's transcript.

    Parses tool_use blocks rather than substring-matching the whole line: this
    conversation discusses the skill by name constantly, and prose mentioning it is
    not consultation.
    """
    if not transcript_path or not os.path.exists(transcript_path):
        return False
    with open(transcript_path, "r", encoding="utf-8", errors="replace") as fh:
        for line in fh:
            line = line.strip()
            if not line or SKILL not in line:
                continue  # cheap prefilter; the parse below is the real check
            try:
                entry = json.loads(line)
            except (ValueError, TypeError):
                continue
            message = entry.get("message") or {}
            content = message.get("content")
            if not isinstance(content, list):
                continue
            for block in content:
                if not isinstance(block, dict):
                    continue
                # The Skill tool call: {"type":"tool_use","name":"Skill",
                #                       "input":{"skill":"contentious-design"}}
                if block.get("type") == "tool_use" and block.get("name") == "Skill":
                    skill_arg = (block.get("input") or {}).get("skill", "")
                    if SKILL in str(skill_arg):
                        return True
                # The user typing /contentious-design, which the harness expands
                # into a command block rather than a Skill tool call.
                if block.get("type") == "text" and f"<command-name>/{SKILL}" in block.get("text", ""):
                    return True
    return False


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except (ValueError, TypeError):
        return 0  # unreadable input is never a reason to block work

    tool_input = payload.get("tool_input") or {}
    path = tool_input.get("file_path") or tool_input.get("notebook_path") or ""

    if not is_ui_file(path):
        return 0

    if skill_was_invoked(payload.get("transcript_path", "")):
        return 0

    json.dump(
        {
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": DENIAL,
            }
        },
        sys.stdout,
    )
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception:
        sys.exit(0)  # a broken gate must never block the repo
