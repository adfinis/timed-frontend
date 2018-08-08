import { Response } from 'ember-cli-mirage'
import moment from 'moment'
import { randomDuration } from './helpers/duration'
import parseDjangoDuration from 'timed/utils/parse-django-duration'
import formatDuration from 'timed/utils/format-duration'

const { parse } = JSON

const statisticEndpoint = type => {
  return function(db) {
    let stats = db[`${type}Statistics`].all()

    return {
      ...this.serialize(stats),
      meta: {
        'total-time': formatDuration(
          stats.models.reduce((total, { duration }) => {
            return total.add(parseDjangoDuration(duration))
          }, moment.duration())
        )
      }
    }
  }
}

const byUserAndDate = modelName => {
  return function(db, { queryParams: { user, date } }) {
    let models = db[modelName].all()

    if (date) {
      models = models.filter(model => {
        return model.date.isSame(date, 'day')
      })
    }

    if (user) {
      models = models.filter(model => {
        return parseInt(model.userId) === parseInt(user)
      })
    }

    return models
  }
}

export default function() {
  this.passthrough('/write-coverage')

  this.urlPrefix = ''
  this.namespace = '/api/v1'
  this.timing = 400
  this.logging = false

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
    { activities },
    { queryParams: { active } }
  ) {
    if (active) {
      return activities.where({ toTime: null })
    }

    return activities.all()
  })
  this.post('/activities', function({ activities, users }) {
    console.log(...this.normalizedRequestAttrs())
    return activities.create({
      ...this.normalizedRequestAttrs(),
      userId: users.first().id
    })
  })
  this.get('/activities/:id')
  this.patch('/activities/:id')
  this.del('/activities/:id')

  this.get('/reports', function(
    { reports },
    { queryParams: { page, page_size: limit } }
  ) {
    let data = reports.all()
    let meta = {
      'total-time': randomDuration()
    }

    page = page && parseInt(page)
    if (page && limit) {
      meta = {
        ...meta,
        pagination: {
          pages: Math.ceil(data.length / limit),
          page
        }
      }

      data = data.slice((page - 1) * limit, page * limit)
    }

    return { ...this.serialize(data), meta }
  })
  this.post('/reports', function({ reports, users }) {
    return reports.create({
      ...this.normalizedRequestAttrs(),
      userId: users.first().id
    })
  })
  this.get('/reports/:id')
  this.patch('/reports/:id')
  this.del('/reports/:id')

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

  this.get('/users', function({ users }, { queryParams: { supervisor } }) {
    if (supervisor) {
      return users.where(user => {
        return user.supervisorIds && user.supervisorIds.includes(supervisor)
      })
    }

    return users.all()
  })
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

  this.get('/employments', function(
    { employments },
    { queryParams: { user } }
  ) {
    let all = employments.all()

    if (user) {
      all = all.filter(e => e.userId === user)
    }

    return all
  })
  this.get('/employments/:id')

  this.get('/absence-types')
  this.get('/absence-types/:id')

  this.get('/billing-types')
  this.get('/billing-types/:id')

  this.get('/cost-centers')
  this.get('/cost-centers/:id')

  this.get('/overtime-credits')
  this.post('/overtime-credits')
  this.get('/overtime-credits/:id')
  this.patch('/overtime-credits/:id')
  this.del('/overtime-credits/:id')

  this.get('/absence-credits')
  this.post('/absence-credits')
  this.get('/absence-credits/:id')
  this.patch('/absence-credits/:id')
  this.del('/absence-credits/:id')

  this.get('/absence-balances', byUserAndDate('absenceBalances'))
  this.get('/absence-balances/:id')

  this.get('/worktime-balances', byUserAndDate('worktimeBalances'))
  this.get('/worktime-balances/:id')

  this.get('/absences', function({ absences }, { queryParams: { user } }) {
    let all = absences.all()

    if (user) {
      all = all.filter(a => a.userId === user)
    }

    return all
  })
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

  this.get('/year-statistics', statisticEndpoint('year'))
  this.get('/month-statistics', statisticEndpoint('month'))
  this.get('/customer-statistics', statisticEndpoint('customer'))
  this.get('/project-statistics', statisticEndpoint('project'))
  this.get('/task-statistics', statisticEndpoint('task'))
  this.get('/user-statistics', statisticEndpoint('user'))

  this.post('/users/:id/transfer', () => new Response(201, {}))

  this.get('/reports/export', function(
    _,
    { queryParams: { file_type: type } }
  ) {
    return new Response(
      200,
      {
        'Content-Disposition': `attachment; filename=testytesyexport.${type}`
      },
      new Blob()
    )
  })

  this.get('/reports/intersection', function({ reportIntersections }) {
    return reportIntersections.first()
  })

  this.post('/reports/bulk', function() {
    return new Response(200, {})
  })
}
