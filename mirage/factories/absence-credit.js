import { Factory, faker } from 'ember-cli-mirage'
import moment from 'moment'

export default Factory.extend({
  date: () => moment().format('YYYY-MM-DD'),
  days: () => faker.random.number({ min: 1, max: 25 }),
  comment: () => faker.lorem.sentence(),

  afterCreate(absenceCredit, server) {
    absenceCredit.update({ absenceTypeId: server.db.absenceTypes[0].id })
  }
})
