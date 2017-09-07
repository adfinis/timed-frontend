import { Response } from 'ember-cli-mirage'
import moment from 'moment'
import { randomDuration } from './helpers/duration'

const { parse } = JSON

export default function() {
  this.passthrough('/write-coverage')

  this.urlPrefix = ''
  this.namespace = '/api/v1'
  this.timing = 400

  this.post('/auth/login', ({ users }, req) => {
    let { data: { attributes: { username, password } } } = parse(
      req.requestBody
    )

    let { models: [user] } = users.where({ username, password })

    if (!user) {
      return new Response(400, {})
    }

    let exp = new Date().getTime() + 30 * 60 * 60 // now plus 30 days
    let payload = `{"user_id":${user.id},"exp":${exp}}`

    return new Response(
      200,
      {},
      {
        data: {
          token: `${btoa('foo')}.${btoa(payload)}.${btoa('pony')}`
        }
      }
    )
  })

  this.post('/auth/refresh', (db, req) => {
    let { token } = parse(req.requestBody)

    return new Response(200, {}, { data: { token } })
  })

  this.get('/attendances', function(
    { attendances },
    { queryParams: { date } }
  ) {
    return attendances.where(a => {
      return a.date === date
    })
  })
  this.post('/attendances', function({ attendances, users }) {
    return attendances.create({
      ...this.normalizedRequestAttrs(),
      userId: users.first().id
    })
  })
  this.get('/attendances/:id')
  this.patch('/attendances/:id')
  this.del('/attendances/:id')

  this.get('/activities', function(
    { activities, activityBlocks },
    { queryParams: { active } }
  ) {
    if (active) {
      return activities.where(a => {
        let blocks = activityBlocks.where(b => b.activityId === a.id).models

        return blocks.any(b => !b.toDatetime)
      })
    }

    return activities.all()
  })
  this.post('/activities', function({ activities, users }) {
    return activities.create({
      ...this.normalizedRequestAttrs(),
      userId: users.first().id
    })
  })
  this.get('/activities/:id')
  this.patch('/activities/:id')
  this.del('/activities/:id')

  this.get('/reports')
  this.post('/reports', function({ reports, users }) {
    return reports.create({
      ...this.normalizedRequestAttrs(),
      userId: users.first().id
    })
  })
  this.get('/reports/:id')
  this.patch('/reports/:id')
  this.del('/reports/:id')

  this.get('/activity-blocks')
  this.post('/activity-blocks', function({ activityBlocks }) {
    return activityBlocks.create({
      ...this.normalizedRequestAttrs(),
      fromDatetime: moment().format()
    })
  })
  this.get('/activity-blocks/:id')
  this.patch('/activity-blocks/:id')
  this.del('/activity-blocks/:id')

  this.get('/customers')
  this.get('/customers/:id')

  this.get('/projects')
  this.get('/projects/:id', function({ projects }, request) {
    return {
      ...this.serialize(projects.find(request.params.id)),
      meta: {
        'spent-time': randomDuration()
      }
    }
  })

  this.get('/tasks')
  this.get('/tasks/:id', function({ tasks }, request) {
    return {
      ...this.serialize(tasks.find(request.params.id)),
      meta: {
        'spent-time': randomDuration()
      }
    }
  })

  this.get('/users')
  this.get('/users/:id')
  this.patch('/users/:id')

  this.get('/public-holidays', function(
    { publicHolidays },
    { queryParams: { date } }
  ) {
    if (date) {
      publicHolidays.where(l => {
        return l.format('YYYY-MM-DD') === date
      })
    }

    return publicHolidays.all()
  })
  this.get('/public-holidays/:id')

  this.get('/locations')
  this.get('/locations/:id')

  this.get('/employments')
  this.get('/employments/:id')

  this.get('/absence-types')
  this.get('/absence-types/:id')

  this.get('/billing-types')
  this.get('/billing-types/:id')

  this.get('/overtime-credits')
  this.get('/overtime-credits/:id')

  this.get('/absences')
  this.post('/absences', function({ absences, users }) {
    return absences.create({
      ...this.normalizedRequestAttrs(),
      userId: users.first().id,
      duration: '08:30:00'
    })
  })
  this.get('/absences/:id')
  this.patch('/absences/:id')
  this.del('/absences/:id')

  this.post('/reports/verify', ({ reports, users }) => {
    let user = users.first()

    reports.all().update('verifiedBy', user)

    return new Response(200, {}, {})
  })
}
