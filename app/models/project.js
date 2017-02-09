/**
 * @module timed
 * @submodule timed-models
 * @public
 */

import Model from 'ember-data/model'
import attr  from 'ember-data/attr'

import {
  belongsTo,
  hasMany
} from 'ember-data/relationships'

/**
 * Project model
 *
 * @class Project
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
   * Whether the project is archived
   *
   * @property archived
   * @type {Boolean}
   * @public
   */
  archived: attr('boolean', { defaultValue: false }),

  /**
   * The customer
   *
   * @property customer
   * @type {Customer}
   * @public
   */
  customer: belongsTo('customer'),

  /**
   * The tasks
   *
   * @property tasks
   * @type {Task[]}
   * @public
   */
  tasks: hasMany('task')
})
