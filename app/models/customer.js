/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model from 'ember-data/model'
import attr from 'ember-data/attr'
import { hasMany } from 'ember-data/relationships'
import { oneWay } from 'ember-computed-decorators'

/**
 * The customer model
 *
 * @class Customer
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
   * The projects
   *
   * @property projects
   * @type {Project[]}
   * @public
   */
  projects: hasMany('project'),

  /**
   * Long name - alias for name, used for filtering in the customer box
   *
   * @property {String} longName
   * @public
   */
  @oneWay('name') longName: ''
})
