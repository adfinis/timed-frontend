/**
 * @module timed
 * @submodule timed-auth
 * @public
 */
import BaseAuthorizer from 'ember-simple-auth/authorizers/base'

/**
 * The application authorizer
 *
 * @class ApplicationAuthorizer
 * @extends BaseAuthorizer
 * @public
 */
export default BaseAuthorizer.extend({
  /**
   * Adds the authorization token to the HTTP request headers
   *
   * @param {String} token The authorization token
   * @param {Function} setRequestHeader The function to set the header
   * @public
   */
  authorize({ token }, setRequestHeader) {
    if (token) {
      setRequestHeader('Authorization', `Bearer ${token}`)
    }
  }
})
