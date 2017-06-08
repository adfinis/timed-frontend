/**
 * @module timed
 * @submodule timed-helpers
 * @public
 */
import { helper }       from 'ember-helper'
import humanizeDuration from 'timed/utils/humanize-duration'

/**
 * The humanize duration helper
 *
 * @function humanizeDurationFn
 * @param {Array} args The arguments delivered to the helper
 * @return {String} The humanized duration
 * @public
 */
export const humanizeDurationFn = (args) => humanizeDuration(...args)

export default helper(humanizeDurationFn)
