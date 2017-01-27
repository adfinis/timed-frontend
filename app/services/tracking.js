import Service from 'ember-service'
import service from 'ember-service/inject'
import moment  from 'moment'

export default Service.extend({
  store: service('store'),

  refresh: false,

  async load() {
    let current = await this.get('store').query('activity', { active: true, include: 'blocks' })

    if (current.get('length')) {
      this.setActivity(current.get('firstObject'))
    }
    else {
      this.newActivity()
    }
  },

  setActivity(activity) {
    this.setProperties({
      currentCustomer: activity.get('task.project.customer') || null,
      currentProject: activity.get('task.project') || null,
      currentActivity: activity
    })
  },

  async startActivity() {
    let activity = this.get('currentActivity')
    let block    = this.get('store').createRecord('activity-block', { activity })

    if (activity.get('isNew')) {
      await activity.save()
    }

    await block.save()

    this.notifyPropertyChange('refresh')
  },

  async stopActivity() {
    let activity = this.get('currentActivity')
    let block    = activity.get('activeBlock')

    block.set('to', moment())

    await block.save()
    await activity.reload()
  },

  newActivity() {
    let activity = this.get('store').createRecord('activity')

    this.setActivity(activity)
  },

  async continueActivity(activity) {
    if (!this.get('currentActivity.isNew')) {
      await this.stopActivity()
    }

    this.setActivity(activity)
    this.startActivity()
  },

  currentCustomer: null,
  currentProject: null,
  currentActivity: null
})
