import Controller from 'ember-controller'
import computed   from 'ember-computed-decorators'
import service    from 'ember-service/inject'
import moment     from 'moment'

export default Controller.extend({
  notify: service('notify'),

  init() {
    this._super(...arguments)

    let activities = this.store.peekAll('activity').filterBy('active', true)

    if (activities.get('length')) {
      this.set('currentActivity', activities.get('firstObject'))
    }
    else {
      this.set('currentActivity', this.store.createRecord('activity'))
    }
  },

  @computed
  customers() {
    return this.store.peekAll('customer')
  },

  @computed
  projects() {
    return this.store.peekAll('project')
  },

  @computed
  tasks() {
    return this.store.peekAll('task')
  },

  currentActivity: null,

  async _startCurrentActivity() {
    try {
      let activity = this.get('currentActivity')

      if (activity.get('isNew')) {
        await activity.save()
      }

      let block = this.store.createRecord('activity-block', { activity })

      await block.save()
    }
    catch(e) {
      this.get('notify').error('Ooops!')
    }
  },

  async _pauseCurrentActivity() {
    try {
      let activity = this.get('currentActivity')

      let block = await activity.get('activeBlock')

      block.set('to', moment())

      await block.save()
    }
    catch(e) {
      this.get('notify').error('Ooops!')
    }
  },

  async _stopCurrentActivity() {
    try {
      let activity = this.get('currentActivity')

      let block = await activity.get('activeBlock')

      if (block) {
        block.set('to', moment())

        await block.save()
      }

      this.set('currentActivity', this.store.createRecord('activity'))
    }
    catch(e) {
      this.get('notify').error('Ooops!')
    }
  },

  actions: {
    startActivity(activity) {
      this.set('currentActivity', activity)
      this._startCurrentActivity(activity)
    },

    stopActivity(activity) {
      this.set('currentActivity', activity)
      this._stopCurrentActivity(activity)
    },

    pauseActivity(activity) {
      this.set('currentActivity', activity)
      this._pauseCurrentActivity(activity)
    },

    async continueActivity(activity) {
      if (!this.get('currentActivity.isNew')) {
        await this._stopCurrentActivity()
      }

      this.set('currentActivity', activity)
      this._startCurrentActivity(activity)
    }
  }
})
