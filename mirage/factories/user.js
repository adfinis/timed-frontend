import { Factory, faker} from 'ember-cli-mirage'

export default Factory.extend({
  username: '',

  firstName() {
    return faker.name.firstName()
  },

  lastName() {
    return faker.name.lastName()
  },

  password() {
    return faker.internet.password()
  },

  afterCreate(user, server) {
    user.username = `${user.firstName}${user.lastName.substr(0, 1)}`.toLowerCase()
  }
})
