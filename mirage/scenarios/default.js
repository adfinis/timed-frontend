export default function(server) {
  // server.logging = false

  server.create('user', {
    firstName: 'John',
    lastName: 'Doe',
    password: '123qwe'
  })

  server.createList('report', 5)

  server.createList('activity', 3)
  server.create('activity', 'active')

  server.create('attendance', 'morning')
  server.create('attendance', 'afternoon')
}
