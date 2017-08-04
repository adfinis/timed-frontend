import Ember from 'ember'
import Controller from 'ember-controller'

const { testing } = Ember

const downloadUrl = filters => {
  /* eslint-disable camelcase */
  let base = '/api/v1/reports/export?'
  return (
    base +
    Object.keys(filters)
      .map(key => {
        return `${key}=${filters[key]}`
      })
      .join('&')
  )
}

export default Controller.extend({
  queryParams: ['page', 'sort'],

  page: 1,

  sort: '-date',

  actions: {
    download(type, filters) {
      let target = `${downloadUrl(filters)}&file_type=${type}`

      if (testing) {
        return
      }
      /* istanbul ignore next */
      window.location.href = target
    }
  }
})
