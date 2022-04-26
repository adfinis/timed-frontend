/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from "@glimmer/component";
import { padStart } from "ember-pad/utils/pad";
import moment from "moment";

const noop = () => {};

/**
 * Timepicker component
 *
 * @class SyTimepickerComponent
 * @extends Ember.Component
 * @public
 */
export default class SyTimepickerComponent extends Component {
  sanitize(value) {
    return value.replace(/[^\d:]/, "");
  }

  /**
   * The input placeholder
   *
   * @property {String} placeholder
   * @public
   */
  placeholder = "00:00";

  /**
   * The maximal length of the value
   *
   * @property {Number} maxlength
   * @public
   */
  maxlength = 5;

  /**
   * The precision of the time
   *
   * 60 needs to be divisible by this
   *
   * @property {Number} precision
   * @public
   */
  precision = 15;

  /**
   * The regex for the input
   *
   * @property {String} pattern
   * @public
   */
  get pattern() {
    const count = 60 / this.precision;
    const minutes = Array.from({ length: count }, (v, i) => (60 / count) * i);

    return `([01]?[0-9]|2[0-3]):(${minutes
      .map((m) => padStart(m, 2))
      .join("|")})`;
  }

  /**
   * The display representation of the value
   *
   * This is the value in the input field.
   *
   * @property {String} displayValue
   * @public
   */
  get displayValue() {
    const value = this.args.value;
    return value && value.isValid() ? value.format("HH:mm") : "";
  }

  /**
   * Init hook, set min and max if not passed
   *
   * @method init
   * @public
   */
  constructor(...args) {
    super(...args);

    const value = this.args.value || moment();

    if (!this.min) {
      this.min = moment(value).set({ h: 0, m: 0 });
    }

    if (!this.max) {
      this.max = moment(value).set({ h: 23, m: 59 });
    }
  }

  /**
   * Handle focus out
   *
   * @event focusOut
   * @param {jQuery.Event} e The jquery focus out event
   * @public
   */
  focusOut() {
    this["on-focus-out"] ?? noop();
  }

  /**
   * Handle input event
   *
   * @event change
   * @param {jQuery.Event} e The jquery change event
   * @public
   */
  change(e) {
    if (e.target.validity.valid) {
      const [h = NaN, m = NaN] = this.sanitize(e.target.value)
        .split(":")
        .map((n) => parseInt(n));

      this._change([h, m].some(isNaN) ? null : this._set(h, m));
    }
  }

  /**
   * Handle keydown event
   *
   * @event keyDown
   * @param {jQuery.Event} e The jquery input event
   * @return {Boolean} Whether to bubble the event or not
   * @public
   */
  keyDown(e) {
    this._handleArrows(e);

    return true;
  }

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
    return moment(this.args.value || this.min).set({ h, m });
  }

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
    let base = this.args.value;

    if (!base) {
      base = [h, m].any((n) => n < 0) ? this.max.add(1, "minute") : this.min;
    }

    return moment(base).add({ h, m });
  }

  /**
   * Get the validity status of a value
   *
   * @method _isValid
   * @param {moment} value The value to check
   * @return {Boolean} Whether the value is valid
   * @private
   */
  _isValid(value) {
    return value < this.max && value > this.min;
  }

  /**
   * Add minutes to the current value
   *
   * @method _addMinutes
   * @param {moment} value The amount of minutes to add
   * @private
   */
  _addMinutes(value) {
    const newValue = this._add(0, value);

    if (this._isValid(newValue)) {
      this._change(newValue);
    }
  }

  /**
   * Add hours to the current value
   *
   * @method _addHours
   * @param {moment} value The amount of hours to add
   * @private
   */
  _addHours(value) {
    const newValue = this._add(value, 0);

    if (this._isValid(newValue)) {
      this._change(newValue);
    }
  }

  /**
   * Ensure that the new value is valid and trigger a change
   *
   * @method change
   * @param {moment} value The new value
   * @private
   */
  _change(value) {
    this.args.onChange(value);
  }

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
          this._addHours(1);
        } else {
          this._addMinutes(this.precision);
        }
        break;
      case 40:
        if (e.ctrlKey || e.shiftKey) {
          this._addHours(-1);
        } else {
          this._addMinutes(-this.precision);
        }
        break;
    }
  }
}
