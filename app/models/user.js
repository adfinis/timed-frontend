/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model from 'ember-data/model'
import attr from 'ember-data/attr'
import { hasMany } from 'ember-data/relationships'
import computed from 'ember-computed-decorators'
import moment from 'moment'

/**
 * The user model
 *
 * @class User
 * @extends DS.Model
 * @public
 */
export default Model.extend({
  /**
   * The username
   *
   * @property {String} username
   * @public
   */
  username: attr('string'),

  /**
   * The first name
   *
   * @property {String} firstName
   * @public
   */
  firstName: attr('string'),

  /**
   * The last name
   *
   * @property {String} lastName
   * @public
   */
  lastName: attr('string'),

  /**
   * The email address
   *
   * @property {String} email
   * @public
   */
  email: attr('string'),

  /**
   * Defines if the user is a staff member or not.
   *
   * @property {Boolean} isStaff
   * @public
   */
  isStaff: attr('boolean'),

  /**
   * Defines if the user is a superuser
   *
   * @property {Boolean} isSuperuser
   * @public
   */
  isSuperuser: attr('boolean'),

  /**
   * Whether a user is active
   *
   * @property {Boolean} isActive
   * @public
   */
  isActive: attr('boolean'),

  /**
   * Whether the user completed the app tour
   *
   * @property {Boolean} tourDone
   * @public
   */
  tourDone: attr('boolean'),

  /**
   * The users supervisors
   *
   * @property {User[]} supervisors
   * @public
   */
  supervisors: hasMany('user', { inverse: 'supervisees' }),

  /**
   * The users supervisees
   *
   * @property {User[]} supervisees
   * @public
   */
  supervisees: hasMany('user', { inverse: 'supervisors' }),

  /**
   * The users employments
   *
   * @property {Employment[]} employments
   * @public
   */
  employments: hasMany('employment'),

  /**
   * The users worktime balances
   *
   * @property {WorktimeBalance[]} worktimeBalances
   * @public
   */
  worktimeBalances: hasMany('worktime-balances'),

  /**
   * The users absence balances
   *
   * @property {AbsenceBalance[]} absenceBalances
   * @public
   */
  absenceBalances: hasMany('absence-balance'),

  /**
   * The full name
   *
   * Consists of the first and last name
   *
   * @property {String} fullName
   * @public
   */
  @computed('firstName', 'lastName')
  fullName(firstName, lastName) {
    if (!firstName && !lastName) {
      return ''
    }

    return `${firstName} ${lastName}`
  },

  /**
   * The long name
   *
   * Consists of the full name and the username. If no full name is given, only
   * the username is returned
   *
   * @property {String} longName
   * @public
   */
  @computed('username', 'fullName')
  longName(username, fullName) {
    return fullName ? `${fullName} (${username})` : username
  },

  /**
   * The active employment
   *
   * An employment is active as soon as it doesn't have a to date
   *
   * @property {Employment} activeEmployment
   * @public
   */
  @computed('employments.[]')
  activeEmployment() {
    return (
      this.store.peekAll('employment').find(e => {
        return (
          e.get('user.id') === this.get('id') &&
          (!e.get('end') || e.get('end').isSameOrAfter(moment.now(), 'day'))
        )
      }) || null
    )
  },

  /**
   * The current worktime balance
   *
   * @property {WorktimeBalance} currentWorktimeBalance
   * @public
   */
  @computed('worktimeBalances.[]')
  currentWorktimeBalance() {
    return (
      this.store.peekAll('worktime-balance').find(balance => {
        return (
          balance.get('user.id') === this.get('id') &&
          balance.get('date').isSame(moment(), 'day')
        )
      }) || null
    )
  }
})
