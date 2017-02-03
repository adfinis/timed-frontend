import BaseAuthenticator from 'ember-simple-auth/authenticators/base'
import { isEmpty }       from 'ember-utils'
import service           from 'ember-service/inject'
import RSVP              from 'rsvp'
import Ember             from 'ember'

import {
  later,
  cancel
} from 'ember-runloop'

const { testing } = Ember

export default BaseAuthenticator.extend({
  ajax: service('ajax'),

  _refreshTokenTimeout: null,

  parseToken(token) {
    let [ , payload ] = token.split('.')
    let tokenData = decodeURIComponent(window.escape(atob(payload)))

    try {
      return JSON.parse(tokenData)
    }
    catch(e) {
      return tokenData
    }
  },

  parseExp(exp) {
    return new Date(exp * 1000).getTime()
  },

  authenticate({ username, password }) {
    return new RSVP.Promise((resolve, reject) => {
      if (isEmpty(username) || isEmpty(password)) {
        reject(new Error('Missing credentials'))
      }

      let data = {
        type: 'obtain-json-web-tokens',
        id: null,
        attributes: { username, password }
      }

      this.get('ajax').post('/api/v1/auth/login', { data: { data } })
        .then((res) => {
          let result = this.handleAuthResponse(res.data)

          resolve(result)
        })
        .catch((res) => {
          reject(res)
        })
    })
  },

  restore(data) {
    return new RSVP.Promise((resolve, reject) => {
      let { token } = data
      let exp       = this.parseExp(data.exp)
      let now       = new Date().getTime()

      if (isEmpty(token)) {
        reject(new Error('Token is empty'))
      }

      if (exp > now) {
        this.scheduleTokenRefresh(exp, token)

        resolve(data)
      }
      else {
        reject(new Error('Token is expired'))
      }
    })
  },

  invalidate(data) {
    return new RSVP.Promise((resolve) => resolve(data))
  },

  refreshToken(token) {
    let data = {
      type: 'refresh-json-web-tokens',
      id: null,
      attributes: { token }
    }

    return new RSVP.Promise((resolve, reject) => {
      this.get('ajax').post('/api/v1/auth/refresh', { data: { data } })
        .then((res) => {
          let result = this.handleAuthResponse(res.data)

          this.trigger('sessionDataUpdated', result)

          resolve(result)
        })
        .catch(reject)
    })
  },

  scheduleTokenRefresh(exp, token) {
    let now  = new Date().getTime()
    let wait = exp - now

    cancel(this._refreshTokenTimeout)

    Reflect.deleteProperty(this, '_refreshTokenTimeout')

    if (!testing) {
      this._refreshTokenTimeout = later(this, this.refreshToken, token, wait)
    }
  },

  handleAuthResponse(response) {
    let { token } = response

    if (isEmpty(token)) {
      throw new Error('Token is empty')
    }

    let data = this.parseToken(token)
    let exp  = this.parseExp(data.exp)

    this.scheduleTokenRefresh(exp, token)

    return { ...data, token }
  }
})
