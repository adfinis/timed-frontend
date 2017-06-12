/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import SyTimepickerComponent from 'timed/components/sy-timepicker/component'
import layout                from 'timed/components/sy-timepicker/template'
import computed              from 'ember-computed-decorators'
import moment                from 'moment'
import formatDuration        from 'timed/utils/format-duration'

/**
 * Duration selector component
 *
 * @class SyDurationpickerComponent
 * @extends Ember.Component
 * @public
 */
export default SyTimepickerComponent.extend({
  layout,

  /**
   * The display representation of the value
   *
   * This is the value in the input field.
   *
   * @property {String} displayValue
   * @public
   */
  pattern: '(([01][0-9]|2[0-3]):(00|15|30|45)|24:00)',

  @computed('value')
  displayValue(value) {
    return value ? formatDuration(value, false) : ''
  },

  /**
   * Set the current value
   *
   * @method _set
   * @param {Number} h The hours of the new value
   * @param {Number} m The minutes of the new value
   * @return {moment.duration} The mutated value
   * @private
   */
  _set(h, m) {
    return moment.duration({ h, m })
  },

  /**
   * Add hours and minutes to the current value
   *
   * @method _add
   * @param {Number} h The hours to add
   * @param {Number} m The minutes to add
   * @return {moment.duration} The mutated value
   * @private
   */
  _add(h, m) {
    return moment.duration(this.get('value')).add({ h, m })
  },

  /**
   * Validate a value
   *
   * @method _validate
   * @param {moment.duration} value The value to check
   * @return {Boolean} Whether the value is valid
   * @private
   */
  _validate(value) {
    return value.asHours() >= 0 && value.asHours() <= 24
  }
})
