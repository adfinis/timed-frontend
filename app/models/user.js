/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model       from 'ember-data/model'
import attr        from 'ember-data/attr'
import { hasMany } from 'ember-data/relationships'
import computed    from 'ember-computed-decorators'

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
   * The users employments
   *
   * @property {Employment[]} employments
   * @public
   */
  employments: hasMany('employment'),

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
    if (!firstName || !lastName) {
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
  }
})
