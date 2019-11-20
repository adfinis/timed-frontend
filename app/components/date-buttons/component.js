import Component from '@ember/component'
import moment from 'moment'

export default Component.extend({
  init() {
    this._super(...arguments)
    this.set('choices', [
      'this week',
      'this month',
      'this year',
      'last week',
      'last month',
      'last year'
    ])
  },

  actions: {
    selectDate(expr) {
      switch (expr) {
        case 'this week':
          this.get('onUpdateFromDate')(moment().day(1))
          this.get('onUpdateToDate')(null)
          break
        case 'this month':
          this.get('onUpdateFromDate')(moment().date(1))
          this.get('onUpdateToDate')(null)
          break
        case 'this year':
          this.get('onUpdateFromDate')(moment().dayOfYear(1))
          this.get('onUpdateToDate')(null)
          break
        case 'last week':
          this.get('onUpdateFromDate')(
            moment()
              .subtract(1, 'week')
              .day(1)
          )
          this.get('onUpdateToDate')(
            moment()
              .subtract(1, 'week')
              .day(7)
          )
          break
        case 'last month':
          this.get('onUpdateFromDate')(
            moment()
              .subtract(1, 'month')
              .startOf('month')
          )
          this.get('onUpdateToDate')(
            moment()
              .subtract(1, 'month')
              .endOf('month')
          )
          break
        case 'last year':
          this.get('onUpdateFromDate')(
            moment()
              .subtract(1, 'year')
              .startOf('year')
          )
          this.get('onUpdateToDate')(
            moment()
              .subtract(1, 'year')
              .endOf('year')
          )
          break
      }
    }
  }
})
