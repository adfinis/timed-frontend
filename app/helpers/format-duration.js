/**
 * @module timed
 * @submodule timed-helpers
 * @public
 */
import { helper } from 'ember-helper'
import formatDuration from 'timed/utils/format-duration'

/**
 * The format duration helper
 *
 * @function formatDurationFn
 * @param {Array} args The arguments delivered to the helper
 * @return {String} The formatted duration
 * @public
 */
export const formatDurationFn = args => formatDuration(...args)

export default helper(formatDurationFn)
