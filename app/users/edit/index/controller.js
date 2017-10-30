import Controller from '@ember/controller'
import { task } from 'ember-concurrency'
import computed from 'ember-computed-decorators'
import moment from 'moment'

const DEFAULT_ABSENCE_LIMIT = 5

export default Controller.extend({
  absenceLimit: DEFAULT_ABSENCE_LIMIT,

  @computed('model.id', 'absenceLimit')
  absences(userId, absenceLimit) {
    let task = this.get('_fetchAbsences')

    task.perform(userId, absenceLimit)

    return task
  },

  @computed('model.id')
  employments(userId) {
    let task = this.get('_fetchEmployments')

    task.perform(userId)

    return task
  },

  _fetchAbsences: task(function*(user, absenceLimit) {
    let pageParams = absenceLimit
      ? {
          page: 1,
          page_size: absenceLimit // eslint-disable-line camelcase
        }
      : {}

    return yield this.store.query('absence', {
      user,
      ordering: '-date',
      // eslint-disable-next-line camelcase
      from_date: moment({
        day: 1,
        month: 0,
        year: this.get('year')
      }).format('YYYY-MM-DD'),
      include: 'type',
      ...pageParams
    })
  }),

  _fetchEmployments: task(function*(user) {
    return yield this.store.query('employment', {
      user,
      ordering: '-from',
      include: 'location'
    })
  }),

  actions: {
    toggleAbsenceLimit() {
      this.set(
        'absenceLimit',
        this.get('absenceLimit') ? null : DEFAULT_ABSENCE_LIMIT
      )
    }
  }
})
