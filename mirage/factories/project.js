import { Factory, faker} from 'ember-cli-mirage'

export default Factory.extend({
  name() {
    return faker.commerce.productName()
  },

  from() {
    return faker.date.past()
  },

  to() {
    return faker.date.future()
  },

  done() {
    return faker.random.boolean()
  }
})
