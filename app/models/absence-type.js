/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model from 'ember-data/model'
import attr  from 'ember-data/attr'

/**
 * The absence type model
 *
 * @class AbsenceType
 * @extends DS.Model
 * @public
 */
export default Model.extend({
  /**
   * The name of the absence type
   *
   * E.g Military, Holiday or Sickness
   *
   * @property {String} name
   * @public
   */
  name: attr('string')
})
