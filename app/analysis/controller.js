import Ember from 'ember'
import Controller from 'ember-controller'
import config from '../config/environment'

const { testing } = Ember

const appendFilters = (url, filters) => {
  return `${url}&${Object.keys(filters)
    .map(key => {
      return `${key}=${filters[key]}`
    })
    .join('&')}`
}

export default Controller.extend({
  queryParams: ['page', 'sort'],

  page: 1,

  sort: '-date',
  exportLinks: config.APP.REPORTEXPORTS,
  actions: {
    download(url, filters) {
      let target = appendFilters(url, filters)

      if (testing) {
        return
      }
      /* istanbul ignore next */
      window.location.href = target
    }
  }
})
