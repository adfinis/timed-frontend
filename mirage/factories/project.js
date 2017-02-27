import { Factory, faker } from 'ember-cli-mirage'

export default Factory.extend({
  name: () => faker.commerce.productName(),
  // customer: association()

  afterCreate(project, server) {
    project.update({ customerId: server.create('customer').id })
  }
})
