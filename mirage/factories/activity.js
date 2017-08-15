import { Factory, faker, trait } from 'ember-cli-mirage'
import { randomDuration } from '../helpers/duration'
import moment from 'moment'

export default Factory.extend({
  comment: () => faker.lorem.sentence(),
  duration: () => randomDuration(1, true),
  // task: association(),

  date: () =>
    moment().set({
      h: 8,
      m: 30,
      s: 0,
      ms: 0
    }),

  afterCreate(activity, server) {
    activity.update({ taskId: server.create('task').id })

    let toDatetime = activity.date.clone()

    let [hours, minutes, seconds] = activity.duration.split(':').map(parseInt)

    toDatetime.add({ hours, minutes, seconds })

    server.create('activity-block', {
      activity,
      fromDatetime: activity.date.clone(),
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
  }),

  overlapping: trait({
    afterCreate(activity, server) {
      server.create('activity-block', {
        activity,
        fromDatetime: moment(),
        toDatetime: moment().add(1, 'days')
      })
    }
  })
})
