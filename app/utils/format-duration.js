/**
 * @module timed
 * @submodule timed-utils
 * @public
 */
import { padStartTpl } from 'ember-pad/utils/pad'
import moment from 'moment'

const { floor, abs } = Math
const padTpl2 = padStartTpl(2)

/**
 * Converts a moment duration into a string with zeropadded digits
 *
 * @function formatDuration
 * @param {moment.duration} duration The duration to format
 * @param {Boolean} seconds Whether to show seconds
 * @return {String} The formatted duration
 * @public
 */
export default function formatDuration(duration, seconds = true) {
  if (typeof duration === 'number') {
    duration = moment.duration(duration)
  }

  if (!moment.isDuration(duration)) {
    return seconds ? '--:--:--' : '--:--'
  }

  let prefix = duration < 0 ? '-' : ''

  let hours = floor(abs(duration.asHours()))
  let minutes = abs(duration.minutes())

  if (seconds) {
    let seconds = abs(duration.seconds())

    return prefix + padTpl2`${hours}:${minutes}:${seconds}`
  }

  return prefix + padTpl2`${hours}:${minutes}`
}
