/**
 * @module timed
 * @submodule timed-utils
 * @public
 */
import moment from 'moment'

/**
 * Converts a django duration string to a moment duration
 *
 * @function parseDjangoDuration
 * @param {String} str The django duration string representation
 * @return {moment.duration} The parsed duration
 * @public
 */
export default function parseDjangoDuration(str) {
  if (!str) {
    return null
  }

  let re = new RegExp(/^(-?\d+)?\s?(\d{2}):(\d{2}):(\d{2})(\.\d{6})?$/)

  let [, days, hours, minutes, seconds, microseconds] = str
    .match(re)
    .map(m => Number(m) || 0)

  return moment.duration({
    days,
    hours,
    minutes,
    seconds,
    milliseconds: microseconds * 1000
  })
}
