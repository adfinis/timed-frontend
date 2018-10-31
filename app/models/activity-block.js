/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model from 'ember-data/model'
import attr from 'ember-data/attr'
import moment from 'moment'
import { computed } from '@ember/object'

import { belongsTo } from 'ember-data/relationships'

/**
 * The activity block model
 *
 * @class ActivityBlock
 * @extends DS.Model
 * @public
 */
export default Model.extend({
  /**
   * The start time
   *
   * @property {moment} fromTime
   * @public
   */
  fromTime: attr('django-time'),

  /**
   * The end time
   *
   * @property {moment} toTime
   * @public
   */
  toTime: attr('django-time'),

  /**
   * The activity
   *
   * @property activity
   * @type {Activity}
   * @public
   */
  activity: belongsTo('activity'),

  /**
   * The start time, with the date of the related activity
   *
   * @property {moment} from
   * @public
   */
  from: computed('activity.date', 'fromTime', {
    get() {
      let time = this.get('fromTime')
      return (
        time &&
        moment(this.get('activity.date')).set({
          h: time.hours(),
          m: time.minutes(),
          s: time.seconds(),
          ms: time.milliseconds()
        })
      )
    },
    set(key, value) {
      this.set('fromTime', value)

      return value
    }
  }),

  /**
   * The end time, with the date of the related activity
   *
   * @property {moment} to
   * @public
   */
  to: computed('activity.date', 'toTime', {
    get() {
      let time = this.get('toTime')
      return (
        time &&
        moment(this.get('activity.date')).set({
          h: time.hours(),
          m: time.minutes(),
          s: time.seconds(),
          ms: time.milliseconds()
        })
      )
    },
    set(key, value) {
      this.set('toTime', value)

      return value
    }
  })
})
