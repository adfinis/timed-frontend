import { Factory, faker, trait } from 'ember-cli-mirage'
import moment from 'moment'

export default Factory.extend({
  fromTime: () => this.activity.date.clone().format('HH:mm:ss'),

  toTime() {
    let start = moment(this.fromDatetime, 'HH:mm:ss')

    return start
      .add(faker.random.number({ min: 15, max: 60 }), 'minutes')
      .add(faker.random.number({ min: 0, max: 59 }), 'seconds')
      .format('HH:mm:ss')
  },

  active: trait({
    toTime: null
  })
})
