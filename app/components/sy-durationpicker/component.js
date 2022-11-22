/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import { action } from "@ember/object";
import { padStart } from "ember-pad/utils/pad";
import moment from "moment";
import SyTimepickerComponent from "timed/components/sy-timepicker/component";
import formatDuration from "timed/utils/format-duration";

const { MIN_SAFE_INTEGER, MAX_SAFE_INTEGER } = Number;
const { abs } = Math;

/**
 * Duration selector component
 *
 * @class SyDurationpickerComponent
 * @extends Ember.Component
 * @public
 */
export default class SyDurationpicker extends SyTimepickerComponent {
  maxlength = null;

  /**
   * The precision of the time
   *
   * 60 needs to be divisible by this
   *
   * @property {Number} precision
   * @public
   */
  precision = 15;

  get min() {
    return this.args.min ?? MIN_SAFE_INTEGER;
  }

  get max() {
    return this.args.max ?? MAX_SAFE_INTEGER;
  }

  /**
   * The regex for the input
   *
   * @property {String} pattern
   * @public
   */
  get pattern() {
    const count = 60 / this.precision;
    const minutes = Array.from({ length: count }, (v, i) => (60 / count) * i);

    return `${this.min < 0 ? "-?" : ""}\\d+:(${minutes
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
    return this.args.value
      ? formatDuration(this.args.value.content ?? this.args.value, false)
      : "";
  }

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
    return moment.duration({ h, m });
  }

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
    return moment.duration(this.args.value).add({ h, m });
  }

  _isValid(duration) {
    return duration < this.max && duration > this.min;
  }

  @action
  change({ target: { validity, value } }) {
    if (validity.valid) {
      const negative = /^-/.test(value);

      const [h = NaN, m = NaN] = this.sanitize(value)
        .split(":")
        .map((n) => abs(parseInt(n)) * (negative ? -1 : 1));

      this._change([h, m].some(isNaN) ? null : this._set(h, m));
    }
  }

  @action
  handleKeyPress(event) {
    super.keyDown(event);
  }
}
