
/**
 * Maps a value from one range to another range.
 *
 * @param {number} value the value to map
 * @param {[number, number]} [inMin, inMax] the range of the value
 * @param {[number, number]} [outMin, outMax] the range to map the value to
 * @return {number} the mapped value
 * @example
 * scale(10, [0, 100], [0, 1000]) // 100
 */
export default function(value, [inMin, inMax], [outMin, outMax]) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}