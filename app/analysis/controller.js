import Ember from 'ember'
import Controller from 'ember-controller'
import service from 'ember-service/inject'
import config from '../config/environment'
import { oneWay } from 'ember-computed-decorators'
import ReportFilterControllerMixin from 'timed/mixins/report-filter-controller'

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

const AnalysisController = Controller.extend(ReportFilterControllerMixin, {
  session: service(),

  /**
   * The current JWT token
   *
   * @property {string} token
   * @public
   */
  @oneWay('session.data.authenticated.token') token: null,

  exportLinks: config.APP.REPORTEXPORTS,

  getTarget(url) {
    let filters = this.get('queryParams').reduce((obj, key) => {
      let val = this.get(key)

      if (val !== null && val !== undefined) {
        obj[key] = val
      }

      return obj
    }, {})

    return appendAuth(appendFilters(url, filters), this.get('token'))
  },

  actions: {
    download(url) {
      let target = this.getTarget(url)

      if (testing) {
        return
      }
      /* istanbul ignore next */
      window.location.href = target
    }
  }
})

export default AnalysisController
