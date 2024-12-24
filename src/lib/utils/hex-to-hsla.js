import hexToRgba from "./hex-to-rgba.js";
import rgbaToHsla from "./rgba-to-hsla.js";

/**
 * Converts a hex color to HSLA (Hue, Saturation, Lightness, Alpha) color.
 *
 * @param {string} hex - A hex color string, e.g. '#ff0000' or '#ff000080'.
 * @return {Array<number>} - An array of four numbers: [hue, saturation, lightness, alpha].
 */
export default function hexToHsla(hex) {
  return rgbaToHsla(...hexToRgba(hex));
}