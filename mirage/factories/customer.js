import { Factory, faker} from 'ember-cli-mirage'

export default Factory.extend({
  name() {
    return faker.company.companyName()
  },

  email() {
    return faker.internet.email()
  },

  website() {
    return faker.internet.url()
  },

  comment() {
    return faker.lorem.paragraph()
  }
})
