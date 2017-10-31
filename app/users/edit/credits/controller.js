import Controller from '@ember/controller'
import { task } from 'ember-concurrency'
import QueryParams from 'ember-parachute'
import moment from 'moment'

const UsersEditCreditsQueryParams = new QueryParams({
  year: {
    defaultValue: moment().year(),
    replace: true,
    refresh: true
  }
})

export default Controller.extend(UsersEditCreditsQueryParams.Mixin, {
  years: task(function*() {
    let employments = yield this.store.query('employment', {
      user: this.get('model.id'),
      ordering: 'start_date'
    })

    let from = (employments.get('firstObject.start') || moment()).year()
    let to = moment()
      .add(1, 'year')
      .year()

    return [
      ...[...new Array(to + 1 - from).keys()].map(i => {
        let y = from + i

        return { value: y, label: y }
      }),
      { value: '', label: 'All' }
    ]
  }),

  setup() {
    this.get('years').perform()
    this.get('absenceCredits').perform()
    this.get('overtimeCredits').perform()
  },

  queryParamsDidChange({ shouldRefresh }) {
    if (shouldRefresh) {
      this.get('absenceCredits').perform()
      this.get('overtimeCredits').perform()
    }
  },

  absenceCredits: task(function*() {
    let year = this.get('year')

    return yield this.store.query('absence-credit', {
      user: this.get('model.id'),
      include: 'absence_type',
      ordering: '-date',
      ...(year ? { year } : [])
    })
  }),

  overtimeCredits: task(function*() {
    let year = this.get('year')

    return yield this.store.query('overtime-credit', {
      user: this.get('model.id'),
      ordering: '-date',
      ...(year ? { year } : [])
    })
  })
})
