import hslaToRgba from "./hsla-to-rgba.js";
import rgbaToHex from "./rgba-to-hex.js";

/**
 * Converts an HSLA color to a hex string.
 *
 * @param {number} h - Hue as a value between 0 and 360.
 * @param {number} s - Saturation as a value between 0 and 100.
 * @param {number} l - Lightness as a value between 0 and 100.
 * @param {number} a - Alpha as a value between 0 and 255 (default is 255).
 * @return {string} - The color in hex format #rrggbbaa or #rrggbb.
 */

export default function hslaToHex(h, s, l, a = 1) {
  return rgbaToHex(...hslaToRgba(h, s, l, a));
}