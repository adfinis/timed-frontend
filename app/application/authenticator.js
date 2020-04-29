/**
 * @module timed
 * @submodule timed-auth
 * @public
 */
import { later, cancel } from "@ember/runloop";
import { inject as service } from "@ember/service";
import { isEmpty } from "@ember/utils";
import Ember from "ember";
import BaseAuthenticator from "ember-simple-auth/authenticators/base";
import { Promise } from "rsvp";

/*
 * If we don't have this buffer, the refresh is triggered too close to token's
 * expiration time or even after it's expired, which can result into unexpected
 * session invalidation.
 */
const TIME_BUFFER = 3 * 60000; // 3 Minutes

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
  ajax: service(),

  /**
   * The session service
   *
   * @property {SessionService} session
   * @public
   */
  session: service(),

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
    const [, payload] = token.split(".");
    const tokenData = decodeURIComponent(window.escape(atob(payload)));

    try {
      return JSON.parse(tokenData);
    } catch (error) {
      return tokenData;
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
    return new Date(exp * 1000).getTime();
  },

  /**
   * Authenticate a session
   *
   * @method authenticate
   * @param {Object} data The credentials
   * @param {String} data.username The username
   * @param {String} data.password The password
   * @return {Promise} A promise which resolves if the login request succeeds
   * @public
   */
  authenticate({ username, password }) {
    return new Promise((resolve, reject) => {
      if (isEmpty(username) || isEmpty(password)) {
        reject(new Error("Missing credentials"));
      }

      const data = {
        type: "token-obtain-pair-views",
        id: null,
        attributes: { username, password }
      };

      this.get("ajax")
        .post("/api/v1/auth/login", { data: { data } })
        .then(res => {
          const result = this._handleAuthResponse(res.data);

          resolve(result);
        })
        .catch(reject);
    });
  },

  /**
   * Restore the session
   *
   * @method restore
   * @param {Object} data The session data
   * @param {String} data.token The token
   * @param {Number} data.exp The expire timestamp of the token
   * @return {Promise} A promise which resolves if the session is restored
   * @public
   */
  restore(data) {
    return new Promise((resolve, reject) => {
      const { refresh } = data;
      const exp = this._parseExp(data.exp);
      const now = new Date().getTime();

      if (isEmpty(refresh)) {
        reject(new Error("Token is empty"));
      }

      if (exp > now) {
        this._scheduleTokenRefresh(exp, refresh);

        resolve(data);
      } else {
        reject(new Error("Token is expired"));
      }
    });
  },

  /**
   * Invalidate the session
   *
   * @method invalidate
   * @param {Object} data The session data
   * @return {Promise} A promise which resolves if the session is invalidated
   * @public
   */
  invalidate(data) {
    return new Promise(resolve => resolve(data));
  },

  /**
   * Refresh the token
   *
   * @method _refreshToken
   * @param {String} refresh The token to refresh
   * @return {Promise} A promise which resolves if the token is refreshed
   * @private
   */
  _refreshToken(refresh) {
    const data = {
      type: "token-refresh-views",
      id: null,
      attributes: { refresh }
    };

    return new Promise((resolve, reject) => {
      this.get("ajax")
        .post("/api/v1/auth/refresh", { data: { data } })
        .then(res => {
          const result = this._handleRefreshResponse(res.data);

          this.trigger("sessionDataUpdated", result);

          resolve(result);
        })
        .catch(reject);
    });
  },

  /**
   * Schedule a token refresh
   *
   * @method _scheduleTokenRefresh
   * @param {Date} exp The expiration date of the token
   * @param {String} token The token to refresh
   * @private
   */
  _scheduleTokenRefresh(exp, token) {
    const now = new Date().getTime();
    const wait = exp - now - TIME_BUFFER;

    cancel(this._refreshTokenTimeout);

    Reflect.deleteProperty(this, "_refreshTokenTimeout");

    if (!Ember.testing) {
      this._refreshTokenTimeout = later(this, this._refreshToken, token, wait);
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
    const { access, refresh } = response;

    if (isEmpty(access)) {
      throw new Error("Access token is empty");
    } else if (isEmpty(refresh)) {
      throw new Error("Refresh token is empty");
    }

    const data = this._parseToken(access);
    const exp = this._parseExp(data.exp);

    this._scheduleTokenRefresh(exp, refresh);

    return { ...data, access, refresh };
  },

  /**
   * Prepare the access and refresh tokens
   * for the _handleAuthResponse method.
   *
   * @method _handleRefreshResponse
   * @param {Object} response The HTTP response
   * @return {Object} The parsed response data
   * @private
   */
  _handleRefreshResponse(response) {
    const { access } = response;
    const { refresh } = this.session.data.authenticated;

    return this._handleAuthResponse({ access, refresh });
  }
});

export default ApplicationAuthenticator;
