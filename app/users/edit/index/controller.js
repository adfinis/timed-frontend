import Controller from '@ember/controller'
import { task } from 'ember-concurrency'
import QueryParams from 'ember-parachute'
import moment from 'moment'

const UsersEditIndexQueryParams = new QueryParams({})

export default Controller.extend(UsersEditIndexQueryParams.Mixin, {
  setup() {
    this.get('absences').perform()
    this.get('employments').perform()
  },

  absences: task(function*() {
    return yield this.store.query('absence', {
      user: this.get('model.id'),
      ordering: '-date',
      // eslint-disable-next-line camelcase
      from_date: moment({
        day: 1,
        month: 0,
        year: this.get('year')
      }).format('YYYY-MM-DD'),
      include: 'type'
    })
  }),

  employments: task(function*() {
    return yield this.store.query('employment', {
      user: this.get('model.id'),
      ordering: '-start_date',
      include: 'location'
    })
  })
})
