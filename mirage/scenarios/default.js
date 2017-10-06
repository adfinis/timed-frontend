export default function(server) {
  // server.logging = false

  server.loadFixtures('absence-types')

  server.createList('billing-type', 3)

  let user = server.create('user', {
    firstName: 'John',
    lastName: 'Doe',
    password: '123qwe'
  })

  server.createList('user', 5, { supervisorIds: [user.id] })
  server.createList('user', 5)

  server.createList('report', 5, { userId: user.id })

  server.createList('activity', 3, { userId: user.id })
  server.create('activity', 'active', { userId: user.id })

  server.create('attendance', 'morning', { userId: user.id })
  server.create('attendance', 'afternoon', { userId: user.id })
}
