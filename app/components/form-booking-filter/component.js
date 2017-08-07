import Component from 'ember-component'
import computed from 'ember-computed-decorators'
import { task } from 'ember-concurrency'
import service from 'ember-service/inject'

const DATE_FORMAT = 'YYYY-MM-DD'

const clean = obj => {
  return Object.keys(obj)
    .filter(key => Boolean(obj[key]))
    .reduce((out, key) => ({ ...out, [key]: obj[key] }), {})
}

const id = obj => obj && obj.get('id')
const formatDate = date => date && date.format(DATE_FORMAT)

export default Component.extend({
  store: service(),
  filters: {},

  @computed('reports.lastSuccessful.value.meta.pagination.count')
  tooManyResults(count) {
    return count > 4000
  },

  @computed('filters.[]')
  cleanFilters(filters) {
    return clean(filters)
  },

  @computed('cleanFilters', 'page')
  reports(cleanFilters, page) {
    /* eslint-disable camelcase */
    this.set('hasCriteria', Boolean(Object.keys(cleanFilters).length))
    if (!this.get('hasCriteria')) {
      return []
    }
    let task = this.get('reportTask')
    task.perform(
      Object.assign({}, cleanFilters, {
        include: 'user,task,task.project,task.project.customer',
        page_size: 10,
        page,
        ordering: '-date'
      })
    )
    return task
  },

  reportTask: task(function*(params) {
    return yield this.get('store').query('report', params)
  }),
  actions: {
    search({ customer, project, task }, user, from, to) {
      this.set('filters', {
        customer: id(customer),
        project: id(project),
        task: id(task),
        user: id(user),
        from_date: formatDate(from), // eslint-disable-line camelcase
        to_date: formatDate(to) // eslint-disable-line camelcase
      })
      this.set('page', 1)
    },
    reset() {
      this.set('customer', null)
      this.set('user', null)
      this.set('from', null)
      this.set('to', null)
    }
  }
})
