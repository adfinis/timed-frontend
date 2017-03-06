/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from 'ember-component'

/**
 * The sy datepicker component
 *
 * @class SyDatepickerComponent
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
   * The actions for the datepicker button component
   *
   * @property {Object} actions
   * @public
   */
  actions: {
    /**
     * Change the value
     *
     * @method change
     * @param {moment} value The value to change to
     * @public
     */
    change(value) {
      this.get('attrs.on-change')(value)
    }
  }
})
