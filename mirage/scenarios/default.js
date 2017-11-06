import moment from 'moment'

export default function(server) {
  server.loadFixtures('absence-types')

  server.createList('billing-type', 3)
  server.createList('cost-center', 3)

  let user = server.create('user', {
    firstName: 'John',
    lastName: 'Doe',
    password: '123qwe',
    isSuperuser: true
  })

  server.createList('user', 5, { supervisorIds: [user.id] })
  server.createList('user', 5)

  server.createList('report', 5, { userId: user.id })

  server.createList('activity', 2, {
    date: moment().subtract(1, 'days'),
    userId: user.id
  })

  server.createList('activity', 3, { userId: user.id })
  server.create('activity', 'active', { userId: user.id })

  server.create('attendance', 'morning', { userId: user.id })
  server.create('attendance', 'afternoon', { userId: user.id })

  server.createList('year-statistic', 2)
  server.createList('month-statistic', 24)
  server.createList('customer-statistic', 10)
  server.createList('project-statistic', 20)
  server.createList('task-statistic', 40)
  server.createList('user-statistic', 5)
}
