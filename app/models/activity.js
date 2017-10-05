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
   * When stopping an activity of a past day, we need to split it
   *
   * @method stop
   * @public
   */
  async stop() {
    /* istanbul ignore next */
    if (!this.get('active')) {
      return
    }

    let daysBetween = moment().diff(this.get('date'), 'days')

    await RSVP.all(
      [
        this,
        ...Object.keys(Array(daysBetween).fill())
          .map(Number)
          .map(n => {
            return this.get('store').createRecord('activity', {
              task: this.get('task'),
              comment: this.get('comment'),
              user: this.get('user'),
              date: moment(this.get('date')).add(n + 1, 'days')
            })
          })
      ].map(async activity => {
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
  }
})
