import { Factory, faker } from 'ember-cli-mirage'
import { randomDuration } from '../helpers/duration'
import moment             from 'moment'

export default Factory.extend({
  comment: () => faker.lorem.sentence(),
  date: () => moment(),
  duration: () => randomDuration(),
  review: () => faker.random.boolean(),
  nta: () => faker.random.boolean(),
  // activity: association(),
  // task: association()

  afterCreate(report, server) {
    report.update({ taskId: server.create('task').id })
  }
})
