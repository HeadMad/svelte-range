/**
 * Clamps a number within the inclusive range specified by the minimum and maximum values.
 *
 * @param {number} value - The number to be clamped.
 * @param {number} min - The lower boundary of the output range.
 * @param {number} max - The upper boundary of the output range.
 * @returns {number} - The clamped value.
 */

export default function(value, min, max) {
  return Math.max(Math.min(value, max), min);;
}