import { Factory, faker } from 'ember-cli-mirage'

export default Factory.extend({
  comment: () => faker.lorem.sentence(),
  notBillable: () => faker.random.boolean(),
  review: () => faker.random.boolean(),
  verified: () => faker.random.boolean(),

  afterCreate(intersection, server) {
    let task = server.create('task')

    intersection.update({
      customerId: task.project.customer.id,
      projectId: task.project.id,
      taskId: task.id
    })
  }
})
