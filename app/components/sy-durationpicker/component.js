/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from 'ember-component'
import computed  from 'ember-computed-decorators'
import moment    from 'moment'

const { floor } = Math

/**
 * Duration selector component
 *
 * This component provides an input box with a selecor where you can increase
 * and decrease hours and minutes of a duration. Currently the biggest minute
 * step is 15 minutes. It does not allow durations longer than 24 hours or
 * less than 0 hours.
 *
 * @class SyDurationpickerComponent
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  /**
   * The hours of the current duration
   *
   * We use the function `.asHours()` here, because `.hours()` would return 0
   * if we have a duration with 24 hours.
   *
   * @property {Number} hours
   * @public
   */
  @computed('value')
  hours(value) {
    return floor(value.asHours())
  },

  /**
   * The minutes of the current duration
   *
   * @property {Number} minutes
   * @public
   */
  @computed('value')
  minutes(value) {
    return value.minutes()
  },

  /**
   * Actions for the sy durationpicker component
   *
   * @property {Object} actions
   * @public
   */
  actions: {
    /**
     * Increase the duration by x minutes
     *
     * @method increase
     * @param {Number} minutes The minutes to add
     * @public
     */
    increase(minutes) {
      value = this.get('value')

      if (value.asHours() * 60 + value.minutes() + minutes > 24 * 60) {
        return
      }

      let value = moment.duration(value).add(minutes, 'minutes')

      this.get('attrs.on-change')(value)
    },

    /**
     * Decrease the duration by x minutes
     *
     * @method decrease
     * @param {Number} minutes The minutes to subtract
     * @public
     */
    decrease(minutes) {
      value = this.get('value')

      if (value.asHours() * 60 + value.minutes() < minutes) {
        return
      }

      let value = moment.duration(value).subtract(minutes, 'minutes')

      this.get('attrs.on-change')(value)
    }
  }
})
