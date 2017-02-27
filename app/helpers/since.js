/**
 * @module timed
 * @submodule timed-helpers
 * @public
 */
import FormatDurationHelper from 'timed/helpers/format-duration'
import { later, cancel }    from 'ember-runloop'
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
   * The timer which ticks every minute
   *
   * @property {*} _timer
   * @private
   */
  _timer: null,

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

    /* istanbul ignore next */
    if (!testing) {
      let timer = later(this, () => {
        this.recompute()
      }, 1000)

      this.set('_timer', timer)
    }

    return this._super([ runtime ])
  },

  /**
   * Clear the timer
   *
   * @method _clearTimer
   * @private
   */
  _clearTimer() {
    /* istanbul ignore next */
    if (!testing) {
      cancel(this.get('_timer'))
      this.set('_timer', null)
    }
  },

  /**
   * Destroy hook, clear the timer on destroy
   *
   * @method destroy
   * @public
   */
  destroy() {
    this._clearTimer()
    this._super(...arguments)
  }
})
