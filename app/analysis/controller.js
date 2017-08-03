import Ember from 'ember'
import Controller from 'ember-controller'
import computed from 'ember-computed-decorators'
import { task } from 'ember-concurrency'

const { testing } = Ember

const DATE_FORMAT = 'YYYY-MM-DD'

const clean = obj => {
  return Object.keys(obj)
    .filter(key => !!obj[key])
    .reduce((out, key) => ({ ...out, [key]: obj[key] }), {})
}

const id = obj => obj && obj.get('id')
const formatDate = date => date && date.format(DATE_FORMAT)

export default Controller.extend({
  filters: {},

  queryParams: ['page', 'sort'],

  page: 1,

  sort: '-date',

  @computed('filters.[]')
  _cleanFilters(filters) {
    return clean(filters)
  },

  @computed('_cleanFilters')
  hasCriteria(cleanFilters) {
    return Boolean(Object.keys(cleanFilters).length)
  },

  @computed('_cleanFilters', 'page', 'sort')
  reports(cleanFilters, page, ordering) {
    /* eslint-disable camelcase */
    if (!this.get('hasCriteria')) {
      return []
    }
    let task = this.get('reportTask')
    task.perform(
      Object.assign({}, cleanFilters, {
        include: 'user,task,task.project,task.project.customer',
        page_size: 10,
        page,
        ordering
      })
    )
    return task
  },

  reportTask: task(function*(params) {
    return yield this.store.query('report', params)
  }).restartable(),

  @computed('reports.lastSuccessful.value.meta.pagination.count')
  tooManyResults(count) {
    return count > 4000
  },

  @computed('_cleanFilters')
  download(cleanFilters) {
    /* eslint-disable camelcase */
    let base = '/api/v1/reports/export?'
    return (
      base +
      Object.keys(cleanFilters)
        .map(key => {
          return `${key}=${cleanFilters[key]}`
        })
        .join('&')
    )
  },

  actions: {
    search({ customer, project, task }, user, from, to) {
      this.set('filters', {
        customer: id(customer),
        project: id(project),
        task: id(task),
        user: id(user),
        from_date: formatDate(from),
        to_date: formatDate(to)
      })
      this.set('page', 1)
    },
    reset() {
      this.set('customer', null)
      this.set('user', null)
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
