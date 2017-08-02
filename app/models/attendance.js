/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model from 'ember-data/model'
import attr from 'ember-data/attr'
import { belongsTo } from 'ember-data/relationships'

/**
 * The attendance model
 *
 * @class Attendance
 * @extends DS.Model
 * @public
 */
export default Model.extend({
  /**
   * The start date and time
   *
   * @property from
   * @type {moment}
   * @public
   */
  from: attr('django-datetime'),

  /**
   * The end date and time
   *
   * @property to
   * @type {moment}
   * @public
   */
  to: attr('django-datetime'),

  /**
   * The user
   *
   * @property user
   * @type {User}
   * @public
   */
  user: belongsTo('user')
})
