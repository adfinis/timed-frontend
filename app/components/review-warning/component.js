import Component from '@ember/component'
import { inject as service } from '@ember/service'
import moment from 'moment'

export default Component.extend({
  isVisible: false,
  session: service('session'),
  store: service('store'),
  startOfMonth: null,
  endOfMonth: null,

  async init() {
    this._super(...arguments)
    // Subtraction is needed because the review warning is only displayed for entries of the last month
    this.startOfMonth = moment()
      .startOf('month')
      .subtract(1, 'months')
    this.endOfMonth = moment()
      .endOf('month')
      .subtract(1, 'months')

    let reports = await this.get('store').query('report', {
      from_date: this.startOfMonth.format('YYYY-MM-DD'),
      to_date: this.endOfMonth.format('YYYY-MM-DD'),
      reviewer: this.get('session.data.user.id'),
      editable: 1
    })

    if (reports.get('length') > 0) {
      this.set('isVisible', true)
    }
  }
})
