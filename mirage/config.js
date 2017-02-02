import { Response } from 'ember-cli-mirage'
import moment       from 'moment'

const { parse } = JSON

export default function() {
  // this.urlPrefix = ''
  this.namespace = '/api/v1'
  this.timing = 400

  this.post('/auth/login', ({ users }, req) => {
    let { data: { attributes: { username, password } } } = parse(req.requestBody)

    let { models: [ user ] } = users.where({ username, password })

    if (!user) {
      return new Response(401, {}, {
        errors: [
          {
            status: 401,
            detail: 'Invalid username or password'
          }
        ]
      })
    }

    let exp     = new Date().getTime() + 30 * 60 * 60 // now plus 30 days
    let payload = `{"user_id":${user.id},"exp":${exp}}`

    return new Response(200, {}, {
      data: { token: `${btoa('foo')}.${btoa(payload)}.${btoa('pony')}` }
    })
  })

  this.post('/auth/refresh', ({ db }, req) => {
    let { data: { attributes: { token } } } = parse(req.requestBody)

    return new Response(200, {}, { data: { token } })
  })

  this.get('/attendances', function({ attendances }, { queryParams: { day } }) {
    return attendances.where((a) => {
      return a.day.format('YYYY-MM-DD') === day
    })
  })

  this.post('/attendances')
  this.get('/attendances/:id')
  this.patch('/attendances/:id')
  this.del('/attendances/:id')

  this.get('/activities', function({ activities, activityBlocks }, { queryParams: { active } }) {
    if (active) {
      return activities.where((a) => {
        let blocks = activityBlocks.where((b) => b.activityId === a.id).models

        return blocks.any((b) => !b.toDatetime)
      })
    }

    return activities.all()
  })
  this.post('/activities')
  this.get('/activities/:id')
  this.patch('/activities/:id')
  this.del('/activities/:id')

  this.get('/activity-blocks')
  this.post('/activity-blocks', function({ activityBlocks }) {
    let attrs = this.normalizedRequestAttrs()

    return activityBlocks.create({ ...attrs, fromDatetime: moment().format() })
  })
  this.get('/activity-blocks/:id')
  this.patch('/activity-blocks/:id')
  this.del('/activity-blocks/:id')

  this.get('/customers', function({ customers }, { queryParams: { search } }) {
    let res = customers.where((c) => {
      return !search || c.name.toLowerCase().indexOf(search.toLowerCase()) >= 0
    })

    return this.serialize(res)
  })

  this.post('/customers')
  this.get('/customers/:id')
  this.patch('/customers/:id')
  this.del('/customers/:id')

  this.get('/projects', function({ projects, customers }, { queryParams: { search, customer } }) {
    let res = projects.where((p) => {
      let c = customers.find(p.customerId)

      return (
        (
          !search
          || p.name.toLowerCase().indexOf(search.toLowerCase()) >= 0
          || c.name.toLowerCase().indexOf(search.toLowerCase()) >= 0
        ) && (
          !customer || c.id === customer
        )
      )
    })

    return this.serialize(res)
  })

  this.post('/projects')
  this.get('/projects/:id')
  this.patch('/projects/:id')
  this.del('/projects/:id')

  this.get('/tasks', function({ tasks }, { queryParams: { project } }) {
    let res = tasks.where((t) => t.projectId === project)

    return this.serialize(res)
  })
  this.post('/tasks')
  this.get('/tasks/:id')
  this.patch('/tasks/:id')
  this.del('/tasks/:id')

  this.get('/users')
  this.post('/users')
  this.get('/users/:id')
  this.patch('/users/:id')
  this.del('/users/:id')
}
