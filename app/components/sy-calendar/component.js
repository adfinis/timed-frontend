import PowerCalendarComponent from 'ember-power-calendar/components/power-calendar'
import moment from 'moment'

const CURRENT_YEAR = moment().year()

const YEARS_IN_FUTURE = 5

export default PowerCalendarComponent.extend({
  months: moment.months(),

  years: [...new Array(40).keys()].map(
    i => `${CURRENT_YEAR + YEARS_IN_FUTURE - i}`
  ),

  actions: {
    changeCenter(unit, event) {
      let date = this.get('publicAPI.center')
      let newCenter = moment(date)[unit](event.target.value)

      this.onCenterChange({ moment: newCenter })
    }
  }
})
