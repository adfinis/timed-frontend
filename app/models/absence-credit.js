/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model         from 'ember-data/model'
import attr          from 'ember-data/attr'
import { belongsTo } from 'ember-data/relationships'

/**
 * The absence credit model
 *
 * @class AbsenceCredit
 * @extends DS.Model
 * @public
 */
export default Model.extend({
  /**
   * The duration
   *
   * @property {moment.duration} duration
   * @public
   */
  duration: attr('django-duration'),

  /**
   * The already used time
   *
   * @property {moment.duration} used
   * @public
   */
  used: attr('django-duration'),

  /**
   * The balance of the credit and the already used time
   *
   * @property {moment.duration} balance
   * @public
   */
  balance: attr('django-duration'),

  /**
   * The absence type for which this credit counts
   *
   * @property {AbsenceType} absenceType
   * @public
   */
  absenceType: belongsTo('absence-type'),

  /**
   * The user to which this credit belongs to
   *
   * @property {User} user
   * @public
   */
  user: belongsTo('user')
})
