/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model from 'ember-data/model'
import attr from 'ember-data/attr'
import moment from 'moment'
import { computed } from '@ember/object'
import RSVP from 'rsvp'
import { inject as service } from '@ember/service'

import { belongsTo } from 'ember-data/relationships'

const { min } = Math

/**
 * The activity model
 *
 * @class Activity
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
   * The comment
   *
   * @property comment
   * @type {String}
   * @public
   */
  comment: attr('string', { defaultValue: '' }),

  /**
   * The date
   *
   * @property {moment} date
   * @public
   */
  date: attr('django-date'),

  transferred: attr('boolean', { defaultValue: false }),

  review: attr('boolean', { defaultValue: false }),

  notBillable: attr('boolean', { defaultValue: false }),

  /**
   * The task
   *
   * @property task
   * @type {Task}
   * @public
   */
  task: belongsTo('task'),

  /**
   * The user
   *
   * @property user
   * @type {User}
   * @public
   */
  user: belongsTo('user'),

  /**
   * The notify service
   *
   * @property {EmberNotify.NotifyService} notify
   * @public
   */
  notify: service('notify'),

  /**
   * Whether the activity is active
   *
   * @property active
   * @type {Boolean}
   * @public
   */
  active: computed('toTime', function() {
    return !this.get('toTime') && !!this.get('id')
  }),

  duration: computed('fromTime', 'toTime', function() {
    return moment.duration(
      (this.get('to') ? this.get('to') : moment()).diff(this.get('from'))
    )
  }),

  from: computed('date', 'fromTime', {
    get() {
      let time = this.get('fromTime')
      return (
        time &&
        moment(this.get('date')).set({
          h: time.hours(),
          m: time.minutes(),
          s: time.seconds(),
          ms: time.milliseconds()
        })
      )
    },
    set(key, val) {
      this.set('fromTime', val)
      return val
    }
  }),

  to: computed('date', 'toTime', {
    get() {
      let time = this.get('toTime')
      return (
        time &&
        moment(this.get('date')).set({
          h: time.hours(),
          m: time.minutes(),
          s: time.seconds(),
          ms: time.milliseconds()
        })
      )
    },
    set(key, val) {
      this.set('toTime', val)
      return val
    }
  }),

  /**
   * Start the activity
   *
   * @method start
   * @public
   */
  async start() {
    let activity = this.get('store').createRecord('activity', {
      date: moment(),
      fromTime: moment(),
      task: this.get('task'),
      comment: this.get('comment'),
      review: this.get('review'),
      notBillable: this.get('notBillable')
    })

    await activity.save()

    return activity
  },

  /**
   * Stop the activity
   *
   * If the activity was started yesterday, we create a new identical
   * activity today so we handle working over midnight
   *
   * If the activity was started even before, we ignore it since it must be
   * a mistake, so we end the activity a second before midnight that day
   *
   * @method stop
   * @public
   */
  async stop() {
    /* istanbul ignore next */
    if (!this.get('active')) {
      return
    }

    let activities = [this]

    if (moment().diff(this.get('date'), 'days') === 1) {
      activities.push(
        this.get('store').createRecord('activity', {
          task: this.get('task'),
          comment: this.get('comment'),
          user: this.get('user'),
          date: moment(this.get('date')).add(1, 'days'),
          review: this.get('review'),
          notBillable: this.get('notBillable'),
          fromTime: moment({ h: 0, m: 0, s: 0 })
        })
      )
    }

    await RSVP.all(
      activities.map(async activity => {
        if (activity.get('isNew')) {
          await activity.save()
        }

        activity.set(
          'toTime',
          moment(
            min(
              moment(activity.get('date')).set({
                h: 23,
                m: 59,
                s: 59
              }),
              moment()
            )
          )
        )

        await activity.save()
      })
    )

    if (moment().diff(this.get('date'), 'days') > 1) {
      this.get(
        'notify'
      ).info(
        'The activity overlapped multiple days, which is not possible. The activity was stopped at midnight of the day it was started.',
        { closeAfter: 5000 }
      )
    }
  }
})
