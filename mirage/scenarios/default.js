import moment from 'moment'
import { faker } from 'ember-cli-mirage'

export default function(server) {
  let user = server.create('user', {
    firstName: 'John',
    lastName: 'Doe',
    password: '123qwe'
  })

  server.createList('user', 9)

  let customers = server.createList('customer', 10)

  customers.forEach((customer) => {
    let projects = server.createList('project', 2, { customer })

    projects.forEach((project) => {
      server.createList('task', 5, { project })
    })
  })

  server.create('attendance', 'morning', { user, day: moment() })
  server.create('attendance', 'afternoon', { user, day: moment() })

  let { schema: { tasks } } = server
  let allTasks = tasks.all().models

  server.create('activity', { user, day: moment(), task: faker.random.arrayElement(allTasks) })
  server.create('activity', 'active', { user, day: moment(), task: faker.random.arrayElement(allTasks) })
}
