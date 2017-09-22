import { Factory, faker, trait } from 'ember-cli-mirage'
import { randomDuration } from '../helpers/duration'
import moment from 'moment'

export default Factory.extend({
  comment: () => faker.lorem.sentence(),
  duration: () => randomDuration(1, true),
  // task: association(),

  date: () => moment(),

  afterCreate(activity, server) {
    activity.update({ taskId: server.create('task').id })

    let toTime = activity.date.clone()

    let [hours, minutes, seconds] = activity.duration.split(':').map(parseInt)

    toTime.add({ hours, minutes, seconds })

    server.create('activity-block', {
      activity,
      fromTime: activity.date.clone(),
      toTime
    })
  },

  active: trait({
    afterCreate(activity, server) {
      server.create('activity-block', {
        activity,
        fromTime: moment(),
        toTime: null
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
        fromTime: moment().subtract(1, 'days'),
        toTime: null
      })
    }
  })
})
