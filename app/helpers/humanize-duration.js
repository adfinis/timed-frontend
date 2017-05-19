/**
 * @module timed
 * @submodule timed-helpers
 * @public
 */
import { helper }         from 'ember-helper'
import humanizeDurationFn from 'timed/utils/humanize-duration'

/**
 * The humanize duration helper
 *
 * @function humanizeDuration
 * @param {Array} args The arguments delivered to the helper
 * @return {String} The humanized duration
 * @public
 */
export const humanizeDuration = (args) => humanizeDurationFn(...args)

export default helper(humanizeDuration)
