/**
 * @module timed
 * @submodule timed-utils
 * @public
 */

const { abs, floor } = Math;

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
    return seconds ? "0h 0m 0s" : "0h 0m";
  }

  const prefix = duration < 0 ? "-" : "";

  // TODO: The locale should be defined by the browser
  const h = floor(abs(duration.asHours())).toLocaleString("de-CH");
  const m = abs(duration.minutes());

  if (seconds) {
    const s = abs(duration.seconds());

    return `${prefix}${h}h ${m}m ${s}s`;
  }

  return `${prefix}${h}h ${m}m`;
}
