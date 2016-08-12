export default function(server) {
  let customers = server.createList('customer', 10)
  let projects  = customers.map(customer => server.create('project', { customer }))
  let users     = server.createList('user', 20)

  server.create('team', { users: users.slice(0,   5) })
  server.create('team', { users: users.slice(5,  10) })
  server.create('team', { users: users.slice(10, 15) })
  server.create('team', { users: users.slice(15, 20) })
}
