import Ember from 'ember'
import Controller from 'ember-controller'
import computed from 'ember-computed-decorators'
import { task } from 'ember-concurrency'

const { testing } = Ember

const DATE_FORMAT = 'YYYY-MM-DD'

const clean = (obj) => {
  return Object.keys(obj)
    .filter((key) => !!obj[key])
    .reduce((out, key) => ({ ...out, [key]: obj[key] }), {})
}

export default Controller.extend({
  filters: {},

  queryParams: [ 'page' ],

  page: 1,

  @computed('filters.[]')
  _cleanFilters(filters) {
    return clean(filters)
  },

  @computed('_cleanFilters', 'page')
  reports(cleanFilters, page) {
    /* eslint-disable camelcase */
    if (!Object.keys(cleanFilters).length) {
      return []
    }
    let task = this.get('reportTask')
    task.perform(Object.assign({}, cleanFilters, {
      include: 'user,task,task.project,task.project.customer',
      page_size: 10,
      page,
      ordering: '-date'
    }))
    return task
  },

  reportTask: task(function* (params) {
    return yield this.store.query('report', params)
  }),

  @computed('reports.lastSuccessful.value.meta.pagination.count')
  tooManyResults(count) {
    return count > 4000
  },

  @computed('_cleanFilters')
  download(cleanFilters) {
    /* eslint-disable camelcase */
    let base = 'http://localhost:8000/api/v1/reports/export?'
    return base + Object.keys(cleanFilters).map((key) => {
      return `${key}=${cleanFilters[key]}`
    }).join('&')
  },

  getDownloadUrl(type) {
    return `${this.get('download')}&file_type=${type}`
  },

  actions: {
    search({ customer, project, task }, user, from, to) {
      this.set('filters', {
        customer: customer && customer.get('id'),
        project: project && project.get('id'),
        task: task && task.get('id'),
        user: user && user.get('id'),
        from_date: from ? from.format(DATE_FORMAT) : null,
        to_date: to ? to.format(DATE_FORMAT) : null
      })
      this.set('page', 1)
    },
    reset() {
      this.set('task', null)
      this.set('from', null)
      this.set('to', null)
    },
    download(type) {
      let target = `${this.get('download')}&file_type=${type}`

      if (testing) {
        return
      }
      /* istanbul ignore next */
      window.location.href = target
    }
  }
})
