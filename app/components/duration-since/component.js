/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from '@ember/component'
import moment from 'moment'
import Ember from 'ember'
import { task, timeout } from 'ember-concurrency'
import { on } from 'ember-computed-decorators'

const { testing } = Ember

/**
 * The duration since component
 *
 * This component helps to determine the duration from a certain moment until
 * now. Optionally you can provide an already elapsed time to add to the
 * duration.
 *
 * Example:
 * ```htmlbars
 * {{duration-since someStartMoment elapsed=someDuration}}
 * ```
 *
 * @class DurationSinceComponent
 * @extends Ember.Component
 * @public
 */
const DurationSinceComponent = Component.extend({
  /**
   * The DOM element of the component
   *
   * @property {String} tagName
   * @public
   */
  tagName: 'span',

  /**
   * The moment from which the duration is computed
   *
   * @property {moment} from
   * @public
   */
  from: moment(),

  /**
   * The already elapsed time which is added to the computed duration
   *
   * @property {moment.duration} elapsed
   * @public
   */
  elapsed: moment.duration(),

  /**
   * The total duration since the from moment plus the elapsed time
   *
   * @property {moment.duration} duration
   * @public
   */
  duration: moment.duration(),

  /**
   * Compute the duration
   *
   * @method _compute
   * @private
   */
  @on('init')
  _compute() {
    this.set(
      'duration',
      moment.duration(moment().diff(this.get('from'))).add(this.get('elapsed'))
    )
  },

  /**
   * The timer function, which causes the duration to be recomputed every second
   *
   * @proprety {*} timer
   * @public
   */
  timer: task(function*() {
    for (;;) {
      this._compute()

      /* istanbul ignore else */
      if (testing) {
        return
      }

      /* istanbul ignore next */
      yield timeout(1000)
    }
  }).on('init')
})

DurationSinceComponent.reopenClass({
  positionalParams: ['from']
})

export default DurationSinceComponent
