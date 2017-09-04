import Ember from 'ember'
import Controller from 'ember-controller'
import service from 'ember-service/inject'
import config from '../config/environment'
import { oneWay } from 'ember-computed-decorators'
import { cleanParams, toQueryString } from 'timed/utils/url'
import ReportFilterControllerMixin from 'timed/mixins/report-filter-controller'

const { testing } = Ember

const AnalysisController = Controller.extend(ReportFilterControllerMixin, {
  session: service(),

  /**
   * The current JWT token
   *
   * @property {string} jwt
   * @public
   */
  @oneWay('session.data.authenticated.token') jwt: null,

  exportLinks: config.APP.REPORTEXPORTS,

  getTarget(url) {
    let queryString = toQueryString(
      cleanParams(
        this.getProperties(
          ...this.get('queryParams').filter(
            key => !['page', 'page_size'].includes(key)
          ),
          'jwt'
        )
      )
    )

    return `${url}&${queryString}`
  },

  actions: {
    download(url) {
      /* istanbul ignore else */
      if (testing) {
        return
      }

      /* istanbul ignore next */
      window.location.href = this.getTarget(url)
    }
  }
})

export default AnalysisController
