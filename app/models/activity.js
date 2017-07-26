/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model    from 'ember-data/model'
import attr     from 'ember-data/attr'
import moment   from 'moment'
import computed from 'ember-computed-decorators'

import {
  belongsTo,
  hasMany
} from 'ember-data/relationships'

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
   * The start date and time
   *
   * @property start
   * @type {moment}
   * @public
   */
  start: attr('django-datetime', { defaultValue: () => moment() }),

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
    let activeBlocks = blocks.filter((b) => !b.get('to'))

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
   * The name of the activity
   *
   * Build as a path "customer > project > task"
   *
   * @property name
   * @type {String}
   * @public
   */
  @computed('task')
  name(task) {
    if (!task) {
      /* istanbul ignore next */
      return ''
    }

    let taskName = task.get('name')
    let projectName = task.get('project.name')
    let customerName = task.get('project.customer.name')

    return `${customerName} > ${projectName} > ${taskName}`
  }
})
