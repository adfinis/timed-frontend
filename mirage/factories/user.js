import { Factory, faker } from 'ember-cli-mirage'

export default Factory.extend({
  firstName() {
    return faker.name.firstName()
  },

  lastName() {
    return faker.name.lastName()
  },

  password() {
    return faker.internet.password()
  },

  username() {
    let first = this.firstName.toLowerCase()
    let last  = this.lastName.toLowerCase()

    return `${first}${last.charAt(0)}`
  }
})
