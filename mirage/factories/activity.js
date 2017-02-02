import { Factory, faker, trait } from 'ember-cli-mirage'
import formatDuration            from 'timed/utils/format-duration'
import moment                    from 'moment'

export default Factory.extend({
  startDatetime() {
    let day = this.day.clone().startOf('day')

    return day
      .add(faker.random.number({ min: 8, max: 15 }), 'hours')
      .add(faker.random.number({ min: 0, max: 59 }), 'minutes')
  },

  comment() {
    return faker.lorem.sentence()
  },

  duration() {
    let duration = moment.duration({
      seconds: faker.random.number({ min: 0, max: 59 }),
      minutes: faker.random.number({ min: 0, max: 59 }),
      hours: faker.random.number({ min: 0, max: 3 })
    })

    return formatDuration(duration)
  },

  afterCreate(activity, server) {
    let toDatetime = activity.startDatetime.clone()

    let [ hours, minutes, seconds ] = activity.duration.split(':').map(parseInt)

    toDatetime.add({ hours, minutes, seconds })

    server.create('activity-block', {
      activity,
      fromDatetime: activity.startDatetime.clone(),
      toDatetime
    })
  },

  active: trait({
    afterCreate(activity, server) {
      let toDatetime = activity.startDatetime.clone()

      let [ hours, minutes, seconds ] = activity.duration.split(':').map(parseInt)

      toDatetime.add({ hours, minutes, seconds })

      let b = server.create('activity-block', {
        activity,
        fromDatetime: activity.startDatetime.clone(),
        toDatetime
      })

      server.create('activity-block', {
        activity,
        fromDatetime: b.toDatetime.clone().add(10, 'minutes'),
        toDatetime: null
      })
    }
  })
})
