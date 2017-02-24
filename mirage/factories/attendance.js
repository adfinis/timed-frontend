import { Factory, trait } from 'ember-cli-mirage'
import moment             from 'moment'

function time(day, hour, minute) {
  return day.clone().millisecond(0).second(0).hour(hour).minute(minute)
}

export default Factory.extend({
  morning: trait({
    fromDatetime() {
      return time(moment(), 8, 0)
    },

    toDatetime() {
      return time(moment(), 11, 30)
    }
  }),

  afternoon: trait({
    fromDatetime() {
      return time(moment(), 12, 0)
    },

    toDatetime() {
      return time(moment(), 17, 0)
    }
  })
})
