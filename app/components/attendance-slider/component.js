/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from '@ember/component'
import { computed } from '@ember/object'
import moment from 'moment'
import formatDuration from 'timed/utils/format-duration'
import { padStartTpl } from 'ember-pad/utils/pad'
import { htmlSafe } from '@ember/string'
import { task } from 'ember-concurrency'

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
    return moment({ hour: 0 })
      .minute(value)
      .format('HH:mm')
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

    this.set('tooltips', [Formatter, Formatter])
    this.set('values', this.get('start'))
  },

  /**
   * The start and end time in minutes
   *
   * @property {Number[]} start
   * @public
   */
  start: computed('attendance.{from,to}', function() {
    return [
      this.get('attendance.from').hour() * 60 +
        this.get('attendance.from').minute(),
      // If the end time is 00:00 we need to clarify that this would be 00:00
      // of the next day
      this.get('attendance.to').hour() * 60 +
        this.get('attendance.to').minute() || 24 * 60
    ]
  }),

  /**
   * The duration of the attendance as a string
   *
   * @property {String} duration
   * @public
   */
  duration: computed('values', function() {
    let from = moment({ hour: 0 }).minute(this.get('values')[0])
    let to = moment({ hour: 0 }).minute(this.get('values')[1])

    return formatDuration(moment.duration(to.diff(from)), false)
  }),

  /**
   * The labels for the slider
   *
   * @property {String[]} labels
   * @public
   */
  labels: computed(function() {
    let labels = []

    for (let h = 0; h <= 24; h++) {
      for (let m = 0; m <= 30 && !(h === 24 && m === 30); m += 30) {
        let offsetH = 100 / 24 * h
        let offsetM = 100 / 24 / 60 * m

        labels.push({
          value: padTpl2`${h}:${m}`,
          size: m === 0 ? 'lg' : 'sm',
          style: htmlSafe(`left: ${offsetH + offsetM}%;`)
        })
      }
    }

    return labels
  }),

  /**
   * Save the attendance
   *
   * @method save
   * @param {Number[]} values The time in minutes
   * @public
   */
  save: task(function*([fromMin, toMin]) {
    let attendance = this.get('attendance')

    attendance.set(
      'from',
      moment(attendance.get('from'))
        .hour(0)
        .minute(fromMin)
    )
    attendance.set(
      'to',
      moment(attendance.get('to'))
        .hour(0)
        .minute(toMin)
    )

    yield this.get('on-save')(attendance)
  }).drop(),

  /**
   * Delete the attendance
   *
   * @method delete
   * @public
   */
  delete: task(function*() {
    yield this.get('on-delete')(this.get('attendance'))
  }).drop()
})
