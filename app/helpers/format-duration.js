/**
 * @module timed
 * @submodule timed-helpers
 * @public
 */
import Helper         from 'ember-helper'
import formatDuration from 'timed/utils/format-duration'

/**
 * The format duration helper
 *
 * @class FormatDurationHelper
 * @extends Ember.Helper
 * @public
 */
export default Helper.extend({
  /**
   * Parse the duration into a string
   *
   * @method computed
   * @param {moment.duration[]} The duration
   * @return {String} The formatted duration
   * @public
   */
  compute([ duration ]) {
    return formatDuration(duration)
  }
})
