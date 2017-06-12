/**
 * @module timed
 * @submodule timed-utils
 * @public
 */

/**
 * Converts a moment duration into a string with hours minutes and optionally
 * seconds
 *
 * @function humanizeDuration
 * @param {moment.duration} duration The duration to format
 * @param {Boolean} seconds Whether to show seconds
 * @return {String} The formatted duration
 * @public
 */
export default function humanizeDuration(duration, seconds = false) {
  if (!duration || duration.milliseconds() < 0) {
    return seconds ? '0h 0m 0s' : '0h 0m'
  }

  let h = duration.hours()
  let m = duration.minutes()

  if (seconds) {
    let s = duration.seconds()

    return `${h}h ${m}m ${s}s`
  }

  return `${h}h ${m}m`
}
