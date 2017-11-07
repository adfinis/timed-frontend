/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import SyTimepickerComponent from 'timed/components/sy-timepicker/component'
import computed from 'ember-computed-decorators'
import moment from 'moment'
import formatDuration from 'timed/utils/format-duration'
import { padStart } from 'ember-pad/utils/pad'

const { MIN_SAFE_INTEGER, MAX_SAFE_INTEGER } = Number

/**
 * Duration selector component
 *
 * @class SyDurationpickerComponent
 * @extends Ember.Component
 * @public
 */
export default SyTimepickerComponent.extend({
  name: 'duration',

  min: MIN_SAFE_INTEGER,

  max: MAX_SAFE_INTEGER,

  maxlength: null,

  sanitize(value) {
    return value.replace(/[^\d:-]/, '')
  },

  /**
   * The precision of the time
   *
   * 60 needs to be divisible by this
   *
   * @property {Number} precision
   * @public
   */
  precision: 15,

  /**
   * The regex for the input
   *
   * @property {String} pattern
   * @public
   */
  @computed('min', 'precision')
  pattern(min, p) {
    let count = 60 / p
    let minutes = Array.from({ length: count }, (v, i) => 60 / count * i)

    return `${min < 0 ? '-?' : ''}\\d+:(${minutes
      .map(m => padStart(m, 2))
      .join('|')})`
  },

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
  }
})
