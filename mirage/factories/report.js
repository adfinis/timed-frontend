import { Factory, faker, trait } from 'ember-cli-mirage'
import { randomDuration }        from '../helpers/duration'
import moment                    from 'moment'

export default Factory.extend({
  comment: () => faker.lorem.sentence(),
  date: () => moment(),
  duration: () => randomDuration(),
  review: () => faker.random.boolean(),
  notBillable: () => faker.random.boolean(),
  // activity: association(),
  // task: association()

  afterCreate(report, server) {
    report.update({ taskId: server.create('task').id })
  },

  absence: trait({
    review: false,
    notBillable: false,

    afterCreate(report, server) {
      report.update({
        taskId: null,
        absenceTypeId: server.create('absenceType').id
      })
    }
  })
})
