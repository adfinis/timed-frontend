import { Factory, faker } from 'ember-cli-mirage'

export default Factory.extend({
  firstName: () => faker.name.firstName(),
  lastName: () => faker.name.lastName(),
  password: () => faker.internet.password(),

  username() {
    let first = this.firstName.toLowerCase()
    let last  = this.lastName.toLowerCase()

    return `${first}${last.charAt(0)}`
  },

  afterCreate(user, server) {
    server.create('employment', { user })
    server.create('employment', 'active', { user })
  }
})
