/**
 * Converts a hex color to an RGBA color.
 *
 * @param {string} hex - A hex color string, e.g. '#ff0000' or '#ff000080'.
 * @return {number[]} - An array of four numbers: [red, green, blue, alpha].
 */
export default function hexToRgba(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const a = Number(parseInt(hex.slice(7, 9) || 'ff', 16) / 255).toFixed(2);
  return [r, g, b, a];
}