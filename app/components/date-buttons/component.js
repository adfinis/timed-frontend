import Component from '@ember/component'
import { A } from '@ember/array'
import moment from 'moment'

export default Component.extend({
  choices: A(['this week', 'this month', 'this year']),
  actions: {
    selectDate(expr) {
      switch (expr) {
        case 'this week':
          this.get('presetDate')(moment().day(1))
          break
        case 'this month':
          this.get('presetDate')(moment().date(1))
          break
        case 'this year':
          this.get('presetDate')(moment().dayOfYear(1))
          break
      }
    }
  }
})
