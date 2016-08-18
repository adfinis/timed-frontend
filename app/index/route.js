import Route   from 'ember-route'
import service from 'ember-service/inject'
import { observes } from 'ember-computed-decorators'

export default Route.extend({
  tracking: service('tracking'),

  model() {
    return this.get('store').query('activity', {
      today: true,
      include: 'task,task.project,task.project.customer,blocks'
    })
  },

  @observes('tracking.refresh')
  _refresh() {
    let activity = this.get('tracking.currentActivity')

    if (!this.get('currentModel').contains(activity)) {
      return this.refresh()
    }

    return activity.reload()
  },

  actions: {
    continueActivity(activity) {
      this.get('tracking').continueActivity(activity)
    }
  }
})
