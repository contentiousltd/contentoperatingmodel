/**
 * Site-wide image service: Astro's built-in sharp service, defaulting to AVIF.
 *
 * Astro has no top-level `image.format` / `image.quality` config - they are per-<Image> props -
 * so the only way to change the default for every image on the site is to wrap the service and
 * fill in the defaults before it validates the options.
 *
 * Why AVIF: see the note in astro.config.mjs. Short version - measured across all 120 assets it
 * is smaller *and* higher fidelity than the WebP q80 it replaces, because WebP codes alpha
 * losslessly and most of our illustrations have large transparent areas.
 *
 * ## Two quality levels
 *
 * `QUALITY.default` (65) is the safe floor and applies to everything not opted in: photographs
 * (staff portraits, portfolio case studies), client logos, and UI screenshots. All three are
 * detail-sensitive - measured at q50 the flat-graphic PNGs lose ~5 dB (notion.png 46.4 -> 41.1)
 * and crisp logo marks fare worse still (actionaid 26.9 dB), while saving only a few KB because
 * they render small anyway.
 *
 * `QUALITY.illustration` (50) is for the large drawn artwork, which is tonally soft and tolerates
 * far more compression: across the alpha illustrations it is 28% smaller than q65, and on the
 * heaviest asset (printing-press-2) saves 107 KB at 32.5 dB - still above the WebP q80 it
 * replaced. Opt in per call site with `quality={QUALITY.illustration}` rather than detecting it,
 * because "has an alpha channel" does not mean "is an illustration": logos have alpha too.
 *
 * A call site passing its own `format`/`quality` always wins; both are left untouched here.
 *
 * Copied from contentious-astro (src/lib/image-service.ts). The one change is the third
 * `logger` argument Astro 7's validateOptions takes, passed straight through.
 */
import sharpService from 'astro/assets/services/sharp';
import type { LocalImageService } from 'astro';

export const QUALITY = {
  /** Photographs, logos, screenshots - anything with crisp edges or faces. */
  default: 65,
  /** Large drawn illustrations, which tolerate heavier compression. */
  illustration: 50,
} as const;

const service: LocalImageService = {
  ...sharpService,

  validateOptions(options, imageConfig, logger) {
    const withDefaults = {
      ...options,
      format: options.format ?? 'avif',
      quality: options.quality ?? QUALITY.default,
    };

    return sharpService.validateOptions
      ? sharpService.validateOptions(withDefaults, imageConfig, logger)
      : withDefaults;
  },
};

export default service;
