/**
 * Converts an RGB color to HSL (Hue, Saturation, Lightness) color.
 * RGB values should be in the range 0-255, while HSL values are normalized to be in the range 0-1.
 * @param {number} r - The red component of the RGB color.
 * @param {number} g - The green component of the RGB color.
 * @param {number} b - The blue component of the RGB color.
 * @return {Array<number>} - An array of three numbers: [hue, saturation, lightness].
 */
export default function rgbaToHsla(r, g, b, a = 1) {
  var d, h, l, max, min, s;
  r /= 255;
  g /= 255;
  b /= 255;
  max = Math.max(r, g, b);
  min = Math.min(r, g, b);
  h = 0;
  s = 0;
  l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  h = Number(h * 360).toFixed(2);
  s = Number(s * 100).toFixed(2);
  l = Number(l * 100).toFixed(2);
  return [h, s, l, a];
}