import Controller from '@ember/controller'
import { task, all, hash } from 'ember-concurrency'
import computed from 'ember-computed-decorators'
import moment from 'moment'

export default Controller.extend({
  @computed('model.id')
  data(userId) {
    let task = this.get('_fetchData')

    task.perform(userId)

    return task
  },

  _fetchData: task(function*(userId) {
    return yield hash({
      worktimeBalanceLastValidTimesheet: this.get(
        '_fetchWorktimeBalanceLastValidTimesheet'
      ).perform(userId),
      worktimeBalanceToday: this.get('_fetchWorktimeBalanceToday').perform(
        userId
      ),
      worktimeBalances: this.get('_fetchWorktimeBalances').perform(userId),
      absenceBalances: this.get('_fetchAbsenceBalances').perform(userId)
    })
  }),

  _fetchWorktimeBalanceLastValidTimesheet: task(function*(user) {
    let worktimeBalance = yield this.store.query('worktime-balance', {
      user,
      date: moment()
        .subtract(1, 'days')
        .format('YYYY-MM-DD')
    })

    return worktimeBalance.get('firstObject')
  }),

  _fetchWorktimeBalanceToday: task(function*(user) {
    let worktimeBalance = yield this.store.query('worktime-balance', {
      user,
      date: moment().format('YYYY-MM-DD')
    })

    return worktimeBalance.get('firstObject')
  }),

  _fetchAbsenceBalances: task(function*(user) {
    return yield this.store.query('absence-balance', {
      user,
      date: moment().format('YYYY-MM-DD'),
      include: 'absence_type'
    })
  }),

  _fetchWorktimeBalances: task(function*(user) {
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
