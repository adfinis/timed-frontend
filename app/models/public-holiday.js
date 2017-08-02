/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model from 'ember-data/model'
import attr from 'ember-data/attr'
import { belongsTo } from 'ember-data/relationships'

/**
 * The public holiday model
 *
 * @class PublicHoliday
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
  name: attr('string'),

  /**
   * The date
   *
   * @property {moment} date
   * @public
   */
  date: attr('django-date'),

  /**
   * The location
   *
   * @property {Location} location
   * @public
   */
  location: belongsTo('location')
})
