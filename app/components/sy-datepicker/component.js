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
