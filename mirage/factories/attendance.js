import { Factory, trait } from 'ember-cli-mirage'
import moment from 'moment'

export default Factory.extend({
  date: moment().format('YYYY-MM-DD'),

  morning: trait({
    fromTime: '08:00:00',
    toTime: '11:30:00'
  }),

  afternoon: trait({
    fromTime: '12:00:00',
    toTime: '17:00:00'
  })
})
