import { Response } from 'ember-cli-mirage'
import moment       from 'moment'

const { parse } = JSON

export default function() {
  this.passthrough('/write-coverage')

  this.urlPrefix = ''
  this.namespace = '/api/v1'
  this.timing    = 400

  this.post('/auth/login', ({ users }, req) => {
    let { data: { attributes: { username, password } } } = parse(req.requestBody)

    let { models: [ user ] } = users.where({ username, password })

    if (!user) {
      return new Response(400, {})
    }

    let exp     = new Date().getTime() + 30 * 60 * 60 // now plus 30 days
    let payload = `{"user_id":${user.id},"exp":${exp}}`

    return new Response(200, {}, { data: {
      token: `${btoa('foo')}.${btoa(payload)}.${btoa('pony')}` }
    })
  })

  this.post('/auth/refresh', (db, req) => {
    let { token } = parse(req.requestBody)

    return new Response(200, {}, { data: { token } })
  })

  this.get('/attendances', function({ attendances }, { queryParams: { day } }) {
    return attendances.where((a) => {
      return moment(a.fromDatetime).format('YYYY-MM-DD') === day
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

  this.get('/reports', function({ reports }, { queryParams: { date } }) {
    return reports.where((r) => r.date === date)
  })
  this.post('/reports')
  this.get('/reports/:id')
  this.patch('/reports/:id')
  this.del('/reports/:id')

  this.get('/activity-blocks')
  this.post('/activity-blocks', function({ activityBlocks }) {
    let attrs = this.normalizedRequestAttrs()

    return activityBlocks.create({ ...attrs, fromDatetime: moment().format() })
  })
  this.get('/activity-blocks/:id')
  this.patch('/activity-blocks/:id')
  this.del('/activity-blocks/:id')

  this.get('/customers')
  this.get('/customers/:id')

  this.get('/projects')
  this.get('/projects/:id')

  this.get('/tasks')
  this.get('/tasks/:id')

  this.get('/users')
  this.get('/users/:id')

  this.get('/public-holidays', function({ locations }, { queryParams: { date } }) {
    if (date) {
      locations.where((l) => {
        return l.format('YYYY-MM-DD') === date
      })
    }

    return locations.all()
  })
  this.get('/public-holidays/:id')

  this.get('/locations')
  this.get('/locations/:id')

  this.get('/employments')
  this.get('/employments/:id')

  this.get('/absence-types')
  this.get('/absence-types/:id')

  this.get('/absence-credits')
  this.get('/absence-credits/:id')

  this.get('/overtime-credits')
  this.get('/overtime-credits/:id')

  this.get('/absences')
  this.post('/absences', function({ absences }) {
    return absences.create({ ...this.normalizedRequestAttrs(), duration: '08:30:00' })
  })
  this.get('/absences/:id')
  this.patch('/absences/:id')
  this.del('/absences/:id')
}
