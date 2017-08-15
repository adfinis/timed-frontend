import { Factory, faker } from 'ember-cli-mirage'

export default Factory.extend({
  days: () => faker.random.number({ min: 1, max: 25 }),
  comment: () => faker.lorem.word()
})
