/**
 * @module timed
 * @submodule timed-utils
 * @public
 */
import { padStartTpl } from 'ember-pad/utils/pad'

const { floor } = Math
const padTpl2   = padStartTpl(2)

/**
 * Converts a moment duration into a string with zeropadded digits
 *
 * @function formatDuration
 * @param {moment.duration} duration The duration to format
 * @param {Boolean} seconds Whether to show seconds
 * @returns {String} The formatted duration
 * @public
 */
export default function formatDuration(duration, seconds = true) {
  if (!duration || duration.milliseconds() < 0) {
    return seconds ? '--:--:--' : '--:--'
  }

  let hours   = floor(duration.asHours())
  let minutes = duration.minutes()

  if (seconds) {
    let seconds = duration.seconds()

    return padTpl2`${hours}:${minutes}:${seconds}`
  }

  return padTpl2`${hours}:${minutes}`
}
