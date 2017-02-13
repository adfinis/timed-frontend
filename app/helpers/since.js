/**
 * @module timed
 * @submodule timed-helpers
 * @public
 */
import FormatDurationHelper from 'timed/helpers/format-duration'
import { later }            from 'ember-runloop'
import moment               from 'moment'
import Ember                from 'ember'

const { testing } = Ember

/**
 * The since helper
 *
 * @class SinceHelper
 * @extends Ember.Helper
 * @public
 */
export default FormatDurationHelper.extend({
  /**
   * Parse the start time plus the elapsed time since then into
   * a string and schedule a recomputing in a second
   *
   * @method computed
   * @param {Array} The start time and the elapsed time
   * @return {String} The formatted duration
   * @public
   */
  compute([ startTime, elapsed = moment.duration() ]) {
    let runtime = moment.duration(moment().diff(startTime)).add(elapsed)

    /* istanbul ignore if */
    if (!testing) {
      later(this, () => {
        this.recompute()
      }, 1000)
    }

    return this._super([ runtime ])
  }
})
