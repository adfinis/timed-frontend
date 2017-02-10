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
   * @property comment
   * @type {String}
   * @public
   */
  comment: attr('string', { defaultValue: '' }),

  /**
   * The duration
   *
   * @property duration
   * @type {moment.duration}
   * @public
   */
  duration: attr('django-duration'),

  /**
   * Whether the report needs to be reviewed
   *
   * @property review
   * @type {Boolean}
   * @public
   */
  review: attr('boolean', { defaultValue: false }),

  /**
   * Whether the report is not to be accumulated
   *
   * @property nta
   * @type {Boolean}
   * @public
   */
  nta: attr('boolean', { defaultValue: false }),

  /**
   * The task from which the report was generated
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
  user: belongsTo('user')
})
