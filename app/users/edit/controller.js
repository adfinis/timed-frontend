import Controller from '@ember/controller'
import { task, all, hash } from 'ember-concurrency'
import moment from 'moment'
import QueryParams from 'ember-parachute'

const UsersEditQueryParams = new QueryParams({})

export default Controller.extend(UsersEditQueryParams.Mixin, {
  setup() {
    this.get('data').perform(this.get('model.id'))
  },

  data: task(function*(uid) {
    return yield hash({
      worktimeBalanceLastValidTimesheet: this.get(
        'worktimeBalanceLastValidTimesheet'
      ).perform(uid),
      worktimeBalanceToday: this.get('worktimeBalanceToday').perform(uid),
      worktimeBalances: this.get('worktimeBalances').perform(uid),
      absenceBalances: this.get('absenceBalances').perform(uid)
    })
  }),

  worktimeBalanceLastValidTimesheet: task(function*(user) {
    let worktimeBalance = yield this.store.query('worktime-balance', {
      user,
      last_reported_date: 1 // eslint-disable-line camelcase
    })

    return worktimeBalance.get('firstObject')
  }),

  worktimeBalanceToday: task(function*(user) {
    let worktimeBalance = yield this.store.query('worktime-balance', {
      user,
      date: moment().format('YYYY-MM-DD')
    })

    return worktimeBalance.get('firstObject')
  }),

  absenceBalances: task(function*(user) {
    return yield this.store.query('absence-balance', {
      user,
      date: moment().format('YYYY-MM-DD'),
      include: 'absence_type'
    })
  }),

  worktimeBalances: task(function*(user) {
    let dates = [...Array(10).keys()]
      .map(i => moment().subtract(i, 'days'))
      .reverse()

    return yield all(
      dates.map(async date => {
        let balance = await this.store.query('worktime-balance', {
          user,
          date: date.format('YYYY-MM-DD')
        })

        return balance.get('firstObject')
      })
    )
  })
})
