/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model from 'ember-data/model'
import attr from 'ember-data/attr'
import moment from 'moment'

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
  estimatedTime: attr('django-duration', {
    defaultValue: () => moment.duration({ h: 200 })
  }),

  /**
   * The spent time for this project
   *
   * @property {moment.duration} spentTime
   * @public
   */
  spentTime: attr('django-duration', {
    defaultValue: () => moment.duration({ h: 88, m: 45 })
  }),

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
