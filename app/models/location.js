/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model from 'ember-data/model'
import attr  from 'ember-data/attr'

/**
 * The location model
 *
 * @class Location
 * @extends DS.Model
 * @public
 */
export default Model.extend({
  /**
   * The name
   *
   * @property {String} name
   * @public
   */
  name: attr('string')
})
