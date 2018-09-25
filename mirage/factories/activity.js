import { Factory, faker, trait } from 'ember-cli-mirage'
//import { randomDuration } from '../helpers/duration'
import moment from 'moment'

export default Factory.extend({
  comment: () => faker.lorem.sentence(),
  transferred: false,
  review: faker.random.boolean(),
  notBillable: faker.random.boolean(),
  // task: association(),

  date: () => moment(),

  fromTime() {
    return this.date.clone().format('HH:mm:ss')
  },

  toTime() {
    let start = moment(this.fromTime, 'HH:mm:ss')

    return start
      .add(faker.random.number({ min: 15, max: 60 }), 'minutes')
      .add(faker.random.number({ min: 0, max: 59 }), 'seconds')
      .format('HH:mm:ss')
  },

  afterCreate(activity, server) {
    activity.update({ taskId: server.create('task').id })
  },

  active: trait({
    toTime: null
  }),

  unknown: trait({
    afterCreate(activity) {
      activity.task.destroy()
    }
  })
})
