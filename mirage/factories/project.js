import { Factory, faker } from 'ember-cli-mirage'
import { randomDuration } from '../helpers/duration'

export default Factory.extend({
  name: () => faker.commerce.productName(),
  estimatedTime: () => randomDuration(),
  // customer: association()

  afterCreate(project, server) {
    project.update({ customerId: server.create('customer').id })

    project.update({ reviewer: server.create('user').id })
  }
})
