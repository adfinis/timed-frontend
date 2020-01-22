import { Factory } from 'ember-cli-mirage'
import faker from 'faker'
import { randomDuration } from '../helpers/duration'
import moment from 'moment'

export default Factory.extend({
  comment: () => faker.lorem.sentence(),
  date: () => moment().format('YYYY-MM-DD'),
  duration: () => randomDuration(),
  review: () => faker.random.boolean(),
  notBillable: () => faker.random.boolean(),
  verifiedBy: null,

  afterCreate(report, server) {
    report.update({ taskId: server.create('task').id })
  }
})
