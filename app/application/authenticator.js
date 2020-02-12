/**
 * @module timed
 * @submodule timed-auth
 * @public
 */
import BaseAuthenticator from 'ember-simple-auth/authenticators/base'
import { isEmpty } from '@ember/utils'
import { inject as service } from '@ember/service'
import RSVP from 'rsvp'
import Ember from 'ember'

import { later, cancel } from '@ember/runloop'

/**
 * The application authorizer
 *
 * This authorizer uses JWT, and implements every function of it
 *
 * @class ApplicationAuthenticator
 * @extends EmberSimpleAuth.BaseAuthenticator
 * @see https://jwt.io
 * @public
 */
/* istanbul ignore next */
const ApplicationAuthenticator = BaseAuthenticator.extend({
  /**
   * The ajax service
   *
   * @property {AjaxService} ajax
   * @public
   */
  ajax: service('ajax'),

  /**
   * The timeout for refreshing the token
   *
   * @property {Object} The timer to use for cancelling
   * @public
   */
  _refreshTokenTimeout: null,

  /**
   * Parse the JWT token
   *
   * @method _parseToken
   * @param {String} token The JWT token to parse
   * @return {Object} The token data
   * @private
   */
  _parseToken(token) {
    let [, payload] = token.split('.')
    let tokenData = decodeURIComponent(window.escape(atob(payload)))

    try {
      return JSON.parse(tokenData)
    } catch (e) {
      return tokenData
    }
  },

  /**
   * Parse the expire date of the token
   *
   * @method _parseExp
   * @param {Number} exp The expire timestamp
   * @return {Date} The date on which the token expires
   * @private
   */
  _parseExp(exp) {
    return new Date(exp * 1000).getTime()
  },

  /**
   * Authenticate a session
   *
   * @method authenticate
   * @param {Object} data The credentials
   * @param {String} data.username The username
   * @param {String} data.password The password
   * @return {RSVP.Promise} A promise which resolves if the login request succeeds
   * @public
   */
  authenticate({ username, password }) {
    return new RSVP.Promise((resolve, reject) => {
      if (isEmpty(username) || isEmpty(password)) {
        reject(new Error('Missing credentials'))
      }

      let data = {
        type: 'token-obtain-pair-views',
        id: null,
        attributes: { username, password }
      }

      this.get('ajax')
        .post('/api/v1/auth/login', { data: { data } })
        .then(res => {
          let result = this._handleAuthResponse(res.data)

          resolve(result)
        })
        .catch(res => {
          reject(res)
        })
    })
  },

  /**
   * Restore the session
   *
   * @method restore
   * @param {Object} data The session data
   * @param {String} data.token The token
   * @param {Number} data.exp The expire timestamp of the token
   * @return {RSVP.Promise} A promise which resolves if the session is restored
   * @public
   */
  restore(data) {
    return new RSVP.Promise((resolve, reject) => {
      let { token } = data
      let exp = this._parseExp(data.exp)
      let now = new Date().getTime()

      if (isEmpty(token)) {
        reject(new Error('Token is empty'))
      }

      if (exp > now) {
        this._scheduleTokenRefresh(exp, token)

        resolve(data)
      } else {
        reject(new Error('Token is expired'))
      }
    })
  },

  /**
   * Invalidate the session
   *
   * @method invalidate
   * @param {Object} data The session data
   * @return {RSVP.Promise} A promise which resolves if the session is invalidated
   * @public
   */
  invalidate(data) {
    return new RSVP.Promise(resolve => resolve(data))
  },

  /**
   * Refresh the token
   *
   * @method _refreshToken
   * @param {String} token The token to refresh
   * @return {RSVP.Promise} A promise which resolves if the token is refreshed
   * @private
   */
  _refreshToken(token) {
    let data = {
      type: 'refresh-json-web-tokens',
      id: null,
      attributes: { token }
    }

    return new RSVP.Promise((resolve, reject) => {
      this.get('ajax')
        .post('/api/v1/auth/refresh', { data: { data } })
        .then(res => {
          let result = this._handleAuthResponse(res.data)

          this.trigger('sessionDataUpdated', result)

          resolve(result)
        })
        .catch(reject)
    })
  },

  /**
   * Schedule a token refresh
   *
   * @method _scheduleTokenRefresh
   * @param {Date} exp The expire date of the token
   * @param {String} token The token to refresh
   * @private
   */
  _scheduleTokenRefresh(exp, token) {
    let now = new Date().getTime()
    let wait = exp - now

    cancel(this._refreshTokenTimeout)

    Reflect.deleteProperty(this, '_refreshTokenTimeout')

    if (!Ember.testing) {
      this._refreshTokenTimeout = later(this, this._refreshToken, token, wait)
    }
  },

  /**
   * Handle the auth responses
   *
   * @method _handleAuthResponse
   * @param {Object} response The HTTP response
   * @return {Object} The parsed response data
   * @private
   */
  _handleAuthResponse(response) {
    let { token } = response

    if (isEmpty(token)) {
      throw new Error('Token is empty')
    }

    let data = this._parseToken(token)
    let exp = this._parseExp(data.exp)

    this._scheduleTokenRefresh(exp, token)

    return { ...data, token }
  }
})

export default ApplicationAuthenticator
