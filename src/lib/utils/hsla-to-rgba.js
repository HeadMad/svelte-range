/**
 * Converts an HSL color to a RGB color.
 *
 * @param {number} h - Hue as a value between 0 and 360.
 * @param {number} s - Saturation as a value between 0 and 100.
 * @param {number} l - Lightness as a value between 0 and 100.
 * @return {number[]} - An array of three numbers: [r, g, b].
 * @example
 * hslToRgb(0, 100, 50) // [255, 0, 0]
 */
export default function hslaToRgba(h, s, l, a = 1) {
  l /= 100;
  const m = s * Math.min(l, 1 - l) / 100;
  const convert = n => {
    const k = (n + h / 30) % 12;
    const color = l - m * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color);
  };
  return [convert(0) ,convert(8) ,convert(4), a];
}