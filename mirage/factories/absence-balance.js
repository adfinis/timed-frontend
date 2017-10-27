import { Factory, trait, faker } from 'ember-cli-mirage'
import moment from 'moment'
import { randomDuration } from '../helpers/duration'

export default Factory.extend({
  date: () => moment(),
  balance: () => randomDuration(),

  days: trait({
    credit: () => faker.random.number({ min: 10, max: 20 }),
    usedDays: () => faker.random.number({ min: 5, max: 25 })
  }),

  duration: trait({
    usedDuration: () => randomDuration()
  })
})
