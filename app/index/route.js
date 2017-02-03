import Route   from 'ember-route'
import RSVP    from 'rsvp'
import service from 'ember-service/inject'
import moment  from 'moment'

export default Route.extend({
  notify: service('notify'),

  queryParams: {
    day: { refreshModel: true }
  },

  model({ day  }) {
    return RSVP.all([
      this.store.query('activity', {
        include: 'task,task.project,task.project.customer',
        day
      }),
      this.store.query('attendance', { day })
    ])
  },

  actions: {
    continueActivity(activity) {
      this.controllerFor('protected').send('continueActivity', activity)
    },

    async saveAttendance(attendance) {
      try {
        await attendance.save()

        this.get('notify').success('Attendance saved')
      }
      catch(e) {
        this.get('notify').error('Ooops! Something went wrong...')
      }
    },

    async deleteAttendance(attendance) {
      try {
        await attendance.destroyRecord()

        this.get('notify').success('Attendance deleted')
      }
      catch(e) {
        this.get('notify').error('Ooops! Something went wrong...')
      }
    },

    async addAttendance() {
      try {
        let from = this.get('controller.date').clone().set({ h: 8, m: 0, s: 0, ms: 0 })
        let to   = this.get('controller.date').clone().set({ h: 11, m: 30, s: 0, ms: 0 })

        let attendance = this.store.createRecord('attendance', { from, to })

        await attendance.save()

        this.get('notify').success('Attendance added')
      }
      catch(e) {
        this.get('notify').error('Ooops! Something went wrong...')
      }
    }
  }
})
