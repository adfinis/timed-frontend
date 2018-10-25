import Component from '@ember/component'
import { inject as service } from '@ember/service'
import moment from 'moment'

export default Component.extend({
  isVisible: false,
  session: service('session'),
  store: service('store'),
  startOfMonth: moment()
    .startOf('month')
    .subtract(1, 'months'),
  endOfMonth: moment()
    .endOf('month')
    .subtract(1, 'months'),

  init() {
    this._super(...arguments)

    // Get reports
    this.get('store')
      .query('report', {
        from_date: this.startOfMonth.format('YYYY-MM-DD'),
        to_date: this.endOfMonth.format('YYYY-MM-DD'),
        reviewer: this.get('session.data.user.id'),
        editable: 1
      })
      .then(reports => {
        // Hide review warning button if no reports found
        if (reports.get('length') > 0) {
          this.set('isVisible', true)
        }
      })
  }
})
