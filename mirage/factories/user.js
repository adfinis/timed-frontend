import { Factory, faker } from 'ember-cli-mirage'
import moment from 'moment'
import DjangoDurationTransform from 'timed/transforms/django-duration'

export default Factory.extend({
  firstName: () => faker.name.firstName(),
  lastName: () => faker.name.lastName(),
  password: () => faker.internet.password(),

  username() {
    let first = this.firstName.toLowerCase()
    let last = this.lastName.toLowerCase()

    return `${first}${last.charAt(0)}`
  },

  email() {
    return `${this.firstName.toLowerCase()}.${this.lastName.toLowerCase()}@adfinis-sygroup.ch`
  },

  worktimeBalance() {
    let balance = moment.duration({
      h:
        faker.random.number({ min: 1, max: 50 }) *
        faker.random.arrayElement([1, -1]),
      m: faker.random.arrayElement([0, 15, 30, 45])
    })

    return DjangoDurationTransform.create().serialize(balance)
  },

  afterCreate(user, server) {
    server.create('employment', { user })
    server.create('employment', 'active', { user })

    server.create('user-absence-type', { user })
    server.create('user-absence-type', 'withFill', { user })
    server.create('user-absence-type', 'withCredit', { user })
  }
})
