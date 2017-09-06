/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model from 'ember-data/model'
import attr from 'ember-data/attr'

import { belongsTo, hasMany } from 'ember-data/relationships'

/**
 * The project model
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
   * The estimated time for this project
   *
   * @property {moment.duration} estimatedTime
   * @public
   */
  estimatedTime: attr('django-duration'),

  /**
   * The customer
   *
   * @property customer
   * @type {Customer}
   * @public
   */
  customer: belongsTo('customer'),

  /**
   * The billing
   *
   * @property {BillingType} billingType
   * @public
   */
  billingType: belongsTo('billing-type'),

  /**
   * The tasks
   *
   * @property tasks
   * @type {Task[]}
   * @public
   */
  tasks: hasMany('task')
})
