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
  belongsTo
} from 'ember-data/relationships'

/**
 * The report model
 *
 * @class Report
 * @extends DS.Model
 * @public
 */
export default Model.extend({
  /**
   * The comment
   *
   * @property {String} comment
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
   * @property {moment.duration} duration
   * @public
   */
  duration: attr('django-duration', { defaultValue: () => moment.duration() }),

  /**
   * Whether the report needs to be reviewed
   *
   * @property {Boolean} review
   * @public
   */
  review: attr('boolean', { defaultValue: false }),

  /**
   * Whether the report is not billable
   *
   * @property {Boolean} notBillable
   * @public
   */
  notBillable: attr('boolean', { defaultValue: false }),

  /**
   * The activity this report was generated from
   *
   * @property {Activity} activity
   * @public
   */
  activity: belongsTo('activity'),

  /**
   * The task
   *
   * @property {Task} task
   * @public
   */
  task: belongsTo('task'),

  /**
   * The user
   *
   * @property {User} user
   * @public
   */
  user: belongsTo('user'),

  /**
   * The name of the report
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
      return ''
    }

    let taskName = task.get('name')
    let projectName = task.get('project.name')
    let customerName = task.get('project.customer.name')

    return `${customerName} > ${projectName} > ${taskName}`
  }
})
