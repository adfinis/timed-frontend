/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from 'ember-component'

/**
 * Timepicker component
 *
 * @class SyTimepickerComponent
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  /**
   * The value
   *
   * @property {moment} value
   * @public
   */
  value: null,

  /**
   * The step used to increase / decrease the minutes
   *
   * This value is in minutes
   *
   * @property {Number} minuteStep
   * @public
   */
  minuteStep: 15,

  /**
   * The step used to increase / decrease the hours
   *
   * This value is in minutes
   *
   * @property {Number} hourStep
   * @public
   */
  hourStep: 60,

  /**
   * Init hook, check if we have an initial value
   *
   * @method init
   * @throws Error
   * @public
   */
  init() {
    this._super(...arguments)

    /* istanbul ignore next */
    if (!this.get('value')) {
      throw new Error('An initial value needs to be defined!')
    }
  },

  /**
   * Round the moment object to 15 minutes
   *
   * @method _round
   * @param {moment} m The moment object to round
   * @return {moment} The rounded moment object
   * @private
   */
  _round(m) {
    return m.clone().minute(Math.round(m.minute() / 15) * 15).second(0)
  },

  /**
   * The timepicker component actions
   *
   * @property {Object} actions
   * @public
   */
  actions: {
    /**
     * Increase the value by the given minutes
     *
     * @method increase
     * @param {Number} minutes The amount of minutes to increase
     * @public
     */
    increase(minutes) {
      let value = this.get('value').clone().add(minutes, 'minutes')

      this.get('attrs.on-change')(this._round(value))
    },

    /**
     * Decrease the value by the given minutes
     *
     * @method increase
     * @param {Number} minutes The amount of minutes to decrease
     * @public
     */
    decrease(minutes) {
      let value = this.get('value').clone().subtract(minutes, 'minutes')

      this.get('attrs.on-change')(this._round(value))
    }
  }
})
