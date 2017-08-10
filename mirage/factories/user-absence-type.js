import AbsenceTypeFactory from './absence-type'
import { belongsTo, faker, trait } from 'ember-cli-mirage'
import { randomDuration } from '../helpers/duration'

export default AbsenceTypeFactory.extend({
  user: belongsTo(),

  credit: null,
  usedDays: () => faker.random.number({ min: 1, max: 30 }),
  usedDuration: null,
  balance: null,

  withFill: trait({
    fillWorktime: true,
    credit: null,
    usedDays: null,
    balance: null,

    usedDuration: () => randomDuration()
  }),

  withCredit: trait({
    credit: () => faker.random.number({ min: 15, max: 25 }),
    usedDays: () => faker.random.number({ min: 1, max: 15 }),

    balance() {
      return this.credit - this.usedDays
    },

    afterCreate(type, server) {
      server.createList('absence-credit', 3, { absenceType: type })
    }
  })
})
