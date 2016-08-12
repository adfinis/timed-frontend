import Service  from 'ember-service'
import service  from 'ember-service/inject'
import computed from 'ember-computed-decorators'

export default Service.extend({
  store: service('store'),

  refresh: false,

  async load() {
    await this.get('store').query('activity', {
      today: true,
      include: 'task,task.project,task.project.customer'
    })

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
      currentProject:  activity.get('task.project') || null,
      currentActivity: activity
    })
  },

  async startActivity() {
    let activity = this.get('currentActivity')
    let block    = this.get('store').createRecord('activity-block', { activity })

    await activity.save()
    await block.save()

    this.notifyPropertyChange('refresh')
  },

  async stopActivity() {
    let activity = this.get('currentActivity')
    let block    = activity.get('activeBlock')

    block.set('to', moment())

    await block.save()
    await activity.reload()

    this.notifyPropertyChange('refresh')
  },

  newActivity() {
    let activity = this.get('store').createRecord('activity')

    this.setActivity(activity)
  },

  continueActivity(activity) {
    this.stopActivity()
    this.setActivity(activity)
    this.startActivity()
  },

  currentCustomer: null,
  currentProject:  null,
  currentActivity: null
})
