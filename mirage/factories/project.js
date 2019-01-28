import { Factory, faker } from 'ember-cli-mirage'
import { randomDuration } from '../helpers/duration'

export default Factory.extend({
  name: () => faker.commerce.productName(),
  estimatedTime: () => randomDuration(),

  afterCreate(project, server) {
    project.update({ customerId: server.create('customer').id })
  }
})
