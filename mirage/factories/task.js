import { Factory, faker } from 'ember-cli-mirage'
import { capitalize }     from 'ember-string'

export default Factory.extend({
  name: () => capitalize(faker.hacker.ingverb()),
  estimatedTime: () => faker.list.random(50, 200, 300, 400, 500, 1000),
  // project: association()

  afterCreate(task, server) {
    task.update({ projectId: server.create('project').id })
  }
})
