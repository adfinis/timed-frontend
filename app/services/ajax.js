/**
 * @module timed
 * @submodule timed-services
 * @public
 */
import service from 'ember-service/inject'
import computed from 'ember-computed-decorators'
import AjaxService from 'ember-ajax/services/ajax'

/**
 * The ajax service
 *
 * @class AjaxService
 * @extends EmberAjax.AjaxService
 * @public
 */
export default AjaxService.extend({
  /**
   * The session service
   *
   * @property {EmberSimpleAuth.SessionService} session
   * @public
   */
  session: service('session'),

  /**
   * The HTTP request headers
   *
   * This contains the content type and the authorization information
   *
   * @property {Object} headers
   * @public
   */
  @computed('session.data.authenticated.token')
  headers(token) {
    let headers = {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json'
    }

    let auth = token
      ? {
          Authorization: `Bearer ${token}`
        }
      : {}

    return Object.assign(headers, auth)
  }
})
