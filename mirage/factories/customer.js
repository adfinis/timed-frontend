import { Factory, faker } from 'ember-cli-mirage'
import { dasherize } from 'ember-string'

export default Factory.extend({
  name() {
    return faker.company.companyName()
  },

  comment() {
    return faker.lorem.sentence()
  },

  domain() {
    let name = this.name.replace(/[\.,_']|(-\W)/g, '')

    return `${dasherize(name)}.${faker.internet.domainSuffix()}`
  },

  website() {
    return `https://${this.domain}`
  },

  email() {
    return `info@${this.domain}`
  }
})
