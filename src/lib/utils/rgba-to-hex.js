/**
 * Converts an RGB(A) color to a hex string.
 *
 * @param {Array<number>} color - [r, g, b] or [r, g, b, a]
 * @return {string} - The color in hex format #rrggbb or #rrggbbaa
 */
 export default function rgbaToHex(r, g, b, a = 1) {
  let hex = '#' + [r,g,b].map(x => x.toString(16).padStart(2, '0')).join('');
  if (a !== 1 )
    hex += Math.round(a * 255).toString(16).padStart(2, '0');
  return hex;
}