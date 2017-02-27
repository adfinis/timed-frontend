/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model from 'ember-data/model'
import attr  from 'ember-data/attr'

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
  duration: attr('django-duration'),

  /**
   * Whether the report needs to be reviewed
   *
   * @property {Boolean} review
   * @public
   */
  review: attr('boolean', { defaultValue: false }),

  /**
   * Whether the report is not to be accumulated
   *
   * @property {Boolean} nta
   * @public
   */
  nta: attr('boolean', { defaultValue: false }),

  /**
   * The activity from which the report was generated
   *
   * @property {Activity} activity
   * @public
   */
  activity: belongsTo('task'),

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
  user: belongsTo('user')
})
