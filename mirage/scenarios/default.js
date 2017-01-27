export default function(server) {
  server.create('user', {
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

  server.loadFixtures('task-templates')
}
