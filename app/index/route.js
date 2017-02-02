import Route        from 'ember-route'
import service      from 'ember-service/inject'
import { observes } from 'ember-computed-decorators'
import moment       from 'moment'
import RSVP         from 'rsvp'

export default Route.extend({
  tracking: service('tracking'),

  queryParams: {
    day: { refreshModel: true }
  },

  model({ day  }) {
    return RSVP.hash({
      activities: this.store.query('activity', {
        include: 'task,task.project,task.project.customer',
        day
      }),
      attendances: this.store.query('attendance', { day })
    })
  },

  @observes('tracking.refresh')
  _refresh() {
    let activity = this.get('tracking.currentActivity')

    this.set('controller.date', moment())

    if (!this.get('currentModel.activities').includes(activity)) {
      this.refresh()
    }
  },

  actions: {
    continueActivity(activity) {
      if (activity.get('active')) {
        return
      }

      this.get('tracking').continueActivity(activity)
    },

    async updateAttendances(values) {
      let attendances = this.get('currentModel.attendances').toArray()
      let deleted     = []

      if (values.length > attendances.get('length')) {
        attendances.pushObject(this.store.createRecord('attendance', {}))
      }

      await attendances.forEach(async(a, i) => {
        if (!values[i]) {
          deleted.pushObject(a)

          await a.destroyRecord()
        }
        else {
          let date = this.get('controller.date')

          let fromDatetime = moment(values[i][0], 'HH:mm')
          let toDatetime   = moment(values[i][1], 'HH:mm')

          let from = moment(date).hour(fromDatetime.hour()).minute(fromDatetime.minute())
          let to   = moment(date).hour(toDatetime.hour()).minute(toDatetime.minute())

          a.setProperties({ from, to })

          await a.save()
        }
      })

      attendances.removeObjects(deleted)

      this.set('currentModel.attendances', attendances)
    }
  }
})
