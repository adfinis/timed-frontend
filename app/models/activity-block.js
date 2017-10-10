/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model from 'ember-data/model'
import attr from 'ember-data/attr'
import moment from 'moment'
import computed from 'ember-computed-decorators'

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
  @computed('activity.date', 'fromTime')
  from(date, time) {
    return (
      time &&
      moment(date).set({
        h: time.hours(),
        m: time.minutes(),
        s: time.seconds(),
        ms: time.milliseconds()
      })
    )
  },

  /**
   * The end time, with the date of the related activity
   * 
   * @property {moment} to
   * @public
   */
  @computed('activity.date', 'toTime')
  to(date, time) {
    return (
      time &&
      moment(date).set({
        h: time.hours(),
        m: time.minutes(),
        s: time.seconds(),
        ms: time.milliseconds()
      })
    )
  }
})
