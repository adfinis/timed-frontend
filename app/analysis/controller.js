import Ember from 'ember'
import Controller from 'ember-controller'
import service from 'ember-service/inject'
import config from '../config/environment'
import { oneWay } from 'ember-computed-decorators'

const { testing } = Ember

const join = (url, toAppend) => {
  let joinSymbol = url.includes('?') ? '&' : '?'
  return url + joinSymbol + toAppend
}

const appendFilters = (url, filters) => {
  return join(
    url,
    Object.keys(filters)
      .map(key => {
        return `${key}=${filters[key]}`
      })
      .join('&')
  )
}

const appendAuth = (url, token) => {
  return join(url, `jwt=${token}`)
}

export default Controller.extend({
  queryParams: ['page', 'sort'],

  page: 1,

  session: service(),

  /**
   * The current JWT token
   *
   * @property {string} token
   * @public
   */
  @oneWay('session.data.authenticated.token') token: null,

  sort: '-date',
  exportLinks: config.APP.REPORTEXPORTS,

  getTarget(url, filters) {
    return appendAuth(appendFilters(url, filters), this.get('token'))
  },

  actions: {
    download(url, filters) {
      let target = this.getTarget(url, filters)

      if (testing) {
        return
      }
      /* istanbul ignore next */
      window.location.href = target
    }
  }
})
