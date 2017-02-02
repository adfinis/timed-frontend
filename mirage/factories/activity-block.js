import { Factory, faker, trait } from 'ember-cli-mirage'

export default Factory.extend({
  fromDatetime() {
    let start = this.activity.startDatetime.clone()

    return start
  },

  toDatetime() {
    let start = this.fromDatetime.clone()

    return start
      .add(faker.random.number({ min: 15, max: 60 }), 'minutes')
      .add(faker.random.number({ min: 0,  max: 59 }), 'seconds')
  },

  active: trait({
    toDatetime: null
  })
})
