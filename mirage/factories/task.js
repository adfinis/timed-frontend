import { Factory } from 'ember-cli-mirage'
import faker from 'faker'
import { capitalize } from '@ember/string'
import { randomDuration } from '../helpers/duration'

export default Factory.extend({
  name: () => capitalize(faker.hacker.ingverb()),
  estimatedTime: () => randomDuration(),

  afterCreate(task, server) {
    task.update({ projectId: server.create('project').id })
  }
})
