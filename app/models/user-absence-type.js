/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import AbsenceType from 'timed/models/absence-type'
import { belongsTo, hasMany } from 'ember-data/relationships'
import attr from 'ember-data/attr'

/**
 * The user absence type model
 *
 * @class UserAbsenceType
 * @extends DS.Model
 * @public
 */
export default AbsenceType.extend({
  /**
   * The credited days
   *
   * @property {Number} credit
   * @public
   */
  credit: attr('number'),

  /**
   * The used days
   *
   * @property {Number} usedDays
   * @public
   */
  usedDays: attr('number'),

  /**
   * The used duration
   *
   * @property {moment.duration} usedDuration
   * @public
   */
  usedDuration: attr('django-duration'),

  /**
   * The balance of credited and used days
   *
   * @property {Number} balance
   * @public
   */
  balance: attr('number'),

  /**
   * The absence credits
   *
   * @property {AbsenceCredit} absenceCredits
   * @public
   */
  absenceCredits: hasMany('absence-credit'),

  /**
   * The user
   *
   * @property {User} user
   * @public
   */
  user: belongsTo('user')
})
