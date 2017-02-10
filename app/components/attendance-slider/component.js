/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component       from 'ember-component'
import computed        from 'ember-computed-decorators'
import moment          from 'moment'
import formatDuration  from 'timed/utils/format-duration'
import { padStartTpl } from 'ember-pad/utils/pad'

const padTpl2 = padStartTpl(2)

/**
 * The formatter for the slider tooltips
 *
 * @constant
 * @type {Object}
 * @public
 */
const Formatter = {
  /**
   * Format the minutes to a time string
   *
   * @method to
   * @param {Number} value The time in minutes
   * @return {String} The formatted time
   * @public
   */
  to(value) {
    return moment({ hour: 0 }).minute(value).format('HH:mm')
  }
}

/**
 * The attendance slider component
 *
 * @class AttendanceSliderComponent
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  /**
   * The attendance
   *
   * @property {Attendance} attendance
   * @public
   */
  attendance: null,

  /**
   * Initialize the component
   *
   * @method init
   * @public
   */
  init() {
    this._super(...arguments)

    this.set('tooltips', [ Formatter, Formatter ])
    this.set('values', this.get('start'))
  },

  /**
   * The start and end time in minutes
   *
   * @property {Number[]} start
   * @public
   */
  @computed('attendance.{from,to}')
  start(from, to) {
    return [
      from.hour() * 60 + from.minute(),
      to.hour() * 60 + to.minute()
    ]
  },

  /**
   * The duration of the attendance as a string
   *
   * @property {String} duration
   * @public
   */
  @computed('values')
  duration([ fromMin, toMin ]) {
    let from = moment({ hour: 0 }).minute(fromMin)
    let to   = moment({ hour: 0 }).minute(toMin)

    return formatDuration(moment.duration(to.diff(from)), false)
  },

  /**
   * The labels for the slider
   *
   * @property {String[]} labels
   * @public
   */
  @computed
  labels() {
    let labels = []

    for (let h = 0; h <= 24; h++) {
      for (let m = 0; m <= 30 && !(h === 24 && m === 30); m += 30) {
        labels.push({
          value: padTpl2`${h}:${m}`,
          size: m === 0 ? 'lg' : 'sm'
        })
      }
    }

    return labels
  },

  /**
   * The actions of the attendance slider component
   *
   * @property {Object} actions
   * @public
   */
  actions: {
    /**
     * Update the values on slide of the slider
     *
     * @method slide
     * @param {Number[]} values The time in minutes
     * @public
     */
    slide(values) {
      this.set('values', values)
    },

    /**
     * Save the attendance
     *
     * @method save
     * @param {Number[]} values The time in minutes
     * @public
     */
    save([ fromMin, toMin ]) {
      this.set('attendance.from', moment({ hour: 0 }).minute(fromMin))
      this.set('attendance.to', moment({ hour: 0 }).minute(toMin))

      this.get('attrs.on-save')(this.get('attendance'))
    },

    /**
     * Delete the attendance
     *
     * @method delete
     * @public
     */
    delete() {
      this.get('attrs.on-delete')(this.get('attendance'))
    }
  }
})
