/**
 * Converts radians to degrees.
 *
 * @param {number} radians - The angle in radians.
 * @return {number} - The angle in degrees.
 */
export default function toDegrees(radians) {
  return radians * (180 / Math.PI);
}