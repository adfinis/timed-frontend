import { Factory, faker, trait } from 'ember-cli-mirage'
import { randomDuration } from '../helpers/duration'
import moment from 'moment'

export default Factory.extend({
  comment: () => faker.lorem.sentence(),
  duration: () => randomDuration(1, true),
  // task: association(),

  startDatetime() {
    let random = moment(faker.date.past())

    return moment().set({
      h: random.hours(),
      m: random.minutes(),
      s: random.seconds()
    })
  },

  afterCreate(activity, server) {
    activity.update({ taskId: server.create('task').id })

    let toDatetime = activity.startDatetime.clone()

    let [hours, minutes, seconds] = activity.duration.split(':').map(parseInt)

    toDatetime.add({ hours, minutes, seconds })

    server.create('activity-block', {
      activity,
      fromDatetime: activity.startDatetime.clone(),
      toDatetime
    })
  },

  active: trait({
    afterCreate(activity, server) {
      server.create('activity-block', {
        activity,
        fromDatetime: moment(),
        toDatetime: null
      })
    }
  }),

  unknown: trait({
    afterCreate(activity) {
      activity.task.destroy()
    }
  })
})
