/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model    from 'ember-data/model'
import attr     from 'ember-data/attr'
import computed from 'ember-computed-decorators'

/**
 * User model
 *
 * @class User
 * @extends DS.Model
 * @public
 */
export default Model.extend({
  /**
   * The username
   *
   * @property username
   * @type {String}
   * @public
   */
  username: attr('string'),

  /**
   * The first name
   *
   * @property firstName
   * @type {String}
   * @public
   */
  firstName: attr('string'),

  /**
   * The last name
   *
   * @property lastName
   * @type {String}
   * @public
   */
  lastName: attr('string'),

  /**
   * The full name
   *
   * Consists of the first and last name
   *
   * @property fullName
   * @type {String}
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
   * @property longName
   * @type {String}
   * @public
   */
  @computed('username', 'fullName')
  longName(username, fullName) {
    return fullName ? `${fullName} (${username})` : username
  }
})
