/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model         from 'ember-data/model'
import attr          from 'ember-data/attr'
import { belongsTo } from 'ember-data/relationships'

/**
 * The task model
 *
 * @class Task
 * @extends DS.Model
 * @public
 */
export default Model.extend({
  /**
   * The name
   *
   * @property name
   * @type {String}
   * @public
   */
  name: attr('string', { defaultValue: '' }),

  /**
   * The estimated time
   *
   * @property estimatedTime
   * @type {Number}
   * @public
   */
  estimatedTime: attr('number'),

  /**
   * Whether the task is archived
   *
   * @property archived
   * @type {Boolean}
   * @public
   */
  archived: attr('boolean', { defaultValue: false }),

  /**
   * The project
   *
   * @property project
   * @type {Project}
   * @public
   */
  project: belongsTo('project')
})
