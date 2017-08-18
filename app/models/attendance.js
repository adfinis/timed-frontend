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
   * The date of the attendance
   *
   * @property {moment} date
   * @public
   */
  date: attr('django-date'),

  /**
   * The start time
   *
   * @property {moment} from
   * @public
   */
  from: attr('django-time'),

  /**
   * The end time
   *
   * @property {moment} to
   * @public
   */
  to: attr('django-time'),

  /**
   * The user
   *
   * @property user
   * @type {User}
   * @public
   */
  user: belongsTo('user')
})
