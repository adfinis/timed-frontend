/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from 'ember-component'
import computed  from 'ember-computed-decorators'
import moment    from 'moment'

/**
 * Timepicker component
 *
 * @class SyTimepickerComponent
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  /**
   * The display representation of the value
   *
   * This is the value in the input field.
   *
   * @property {String} displayValue
   * @public
   */
  @computed('value')
  displayValue(value) {
    return value && value.isValid() ? value.format('HH:mm') : ''
  },

  /**
   * Set the current value
   *
   * @method _set
   * @param {Number} h The hours of the new value
   * @param {Number} m The minutes of the new value
   * @return {moment} The mutated value
   * @private
   */
  _set(h, m) {
    return moment(this.get('value')).set({ h, m })
  },

  /**
   * Add hours and minutes to the current value
   *
   * @method _add
   * @param {Number} h The hours to add
   * @param {Number} m The minutes to add
   * @return {moment} The mutated value
   * @private
   */
  _add(h, m) {
    return moment(this.get('value')).add({ h, m })
  },

  /**
   * Validate a value
   *
   * @method _validate
   * @param {moment} value The value to check
   * @return {Boolean} Whether the value is valid
   * @private
   */
  _validate(value) {
    return value.isSame(this.get('value'), 'day')
  },

  /**
   * Add minutes to the current value
   *
   * @method _addMinutes
   * @param {moment} value The amount of minutes to add
   * @private
   */
  _addMinutes(value) {
    this._change(this._add(0, value))
  },

  /**
   * Add hours to the current value
   *
   * @method _addHours
   * @param {moment} value The amount of hours to add
   * @private
   */
  _addHours(value) {
    this._change(this._add(value, 0))
  },

  /**
   * Ensure that the new value is valid and trigger a change
   *
   * @method change
   * @param {moment} value The new value
   * @private
   */
  _change(value) {
    if (this._validate(value)) {
      this.get('attrs.on-change')(value)
    }
  },

  /**
   * The regex for the input
   *
   * @property {String} pattern
   * @public
   */
  pattern: '([01][0-9]|2[0-3]):(00|15|30|45)',

  /**
   * Increase or decrease the current value
   *
   * If the shift or ctrl key is pressed it changes the hours instead of the
   * minutes.
   *
   * @method _handleArrows
   * @param {jQuery.Event} e The keydown event
   * @private
   */
  _handleArrows(e) {
    switch (e.keyCode) {
      case 38:
        if (e.ctrlKey || e.shiftKey) {
          this._addHours(1)
        }
        else {
          this._addMinutes(15)
        }
        break
      case 40:
        if (e.ctrlKey || e.shiftKey) {
          this._addHours(-1)
        }
        else {
          this._addMinutes(-15)
        }
        break
      default:
        break
    }
  },

  /**
   * Actions for the timepicker component
   *
   * @property {Object} actions
   * @public
   */
  actions: {
    /**
     * Handle input event
     *
     * This is called when the value in the input box was changed. It ensures
     * that the value is valid and updates the value accordingly.
     *
     * @method handleInput
     * @param {jQuery.Event} e The jquery input event
     * @public
     */
    handleInput(e) {
      if (e.target.validity.valid) {
        let [ h, m ] = e.target.value.split(':').map(Number)

        this._change(this._set(h, m))
      }
    },

    /**
     * Handle keydown event
     *
     * This is called when the input is focused and a key was pressed. It
     * ensures that the pressed key can be used for changing the value.
     *
     * @method handleKeyDown
     * @param {jQuery.Event} e The jquery input event
     * @return {Boolean} Whether to bubble the event or not
     * @public
     */
    handleKeyDown(e) {
      if (e.key.length === 1 && (!/[\d:]/.test(e.key) || e.target.value.length === 5)) {
        e.preventDefault()

        return false
      }

      this._handleArrows(e)

      return true
    }
  }
})
