import { Factory, trait } from 'ember-cli-mirage'
import moment             from 'moment'

function time(day, hour, minute) {
  return day.clone().millisecond(0).second(0).hour(hour).minute(minute)
}

export default Factory.extend({
  day: moment(),

  morning: trait({
    fromDatetime() {
      return time(this.day, 8, 0)
    },

    toDatetime() {
      return time(this.day, 11, 30)
    }
  }),

  afternoon: trait({
    fromDatetime() {
      return time(this.day, 12, 0)
    },

    toDatetime() {
      return time(this.day, 17, 0)
    }
  })
})
