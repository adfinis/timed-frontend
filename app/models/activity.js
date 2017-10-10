/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model from 'ember-data/model'
import attr from 'ember-data/attr'
import moment from 'moment'
import computed from 'ember-computed-decorators'
import RSVP from 'rsvp'
import { inject as service } from '@ember/service'

import { belongsTo, hasMany } from 'ember-data/relationships'

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

  /**
   * The duration
   *
   * @property duration
   * @type {moment.duration}
   * @public
   */
  duration: attr('django-duration'),

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
   * The blocks
   *
   * @property blocks
   * @type {ActivityBlock[]}
   * @public
   */
  blocks: hasMany('activity-block'),

  /**
   * The notify service
   *
   * @property {EmberNotify.NotifyService} notify
   * @public
   */
  notify: service('notify'),

  /**
   * The currently active block
   *
   * @property activeBlock
   * @type {ActivityBlock}
   * @public
   */
  @computed('blocks.@each.to')
  activeBlock(blocks) {
    let activeBlocks = blocks.filter(b => !b.get('to'))

    return activeBlocks.get('length') ? activeBlocks.get('firstObject') : null
  },

  /**
   * Whether the activity is active
   *
   * @property active
   * @type {Boolean}
   * @public
   */
  @computed('activeBlock')
  active(block) {
    return Boolean(block && block.get('from'))
  },

  /**
   * Start the activity
   *
   * @method start
   * @public
   */
  async start() {
    /* istanbul ignore next */
    if (this.get('active')) {
      return
    }

    if (this.get('isNew')) {
      await this.save()
    }

    let block = this.get('store').createRecord('activity-block', {
      activity: this,
      fromTime: moment()
    })

    await block.save()

    // Sadly, we need to do this here since the computed property
    // 'activeBlock' on the activity does not sense a change when the blocks
    // change from new to actually loaded
    this.notifyPropertyChange('blocks')
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
          date: moment(this.get('date')).add(1, 'days')
        })
      )
    }

    await RSVP.all(
      activities.map(async activity => {
        if (activity.get('isNew')) {
          await activity.save()
        }

        let block =
          activity.get('activeBlock') ||
          this.get('store').createRecord('activity-block', {
            activity,
            fromTime: moment({ h: 0, m: 0, s: 0 })
          })

        block.set(
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

        await block.save({ adapterOptions: { include: 'activity' } })
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
