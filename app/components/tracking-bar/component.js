import Component       from 'ember-component'
import service         from 'ember-service/inject'

import computed, {
  alias,
  bool
} from 'ember-computed-decorators'

export default Component.extend({
  store: service('store'),

  tracking: service('tracking'),

  @alias('tracking.currentCustomer') customer: null,

  @alias('tracking.currentProject') project: null,

  @alias('tracking.currentActivity.task') task: null,

  @alias('tracking.currentActivity') activity: null,

  @computed()
  _allProjects() {
    return this.get('store').peekAll('project')
  },

  @computed()
  _allTasks() {
    return this.get('store').peekAll('task')
  },

  @computed()
  customers() {
    return this.get('store').peekAll('customer')
  },

  @computed('customer')
  projects(customer) {
    if (!customer) return []

    return this.get('_allProjects').filter((project) => {
      return project.get('customer.id') === customer.get('id')
    })
  },

  @computed('project')
  tasks(project) {
    if (!project) return []

    return this.get('_allTasks').filter((task) => {
      return task.get('project.id') === project.get('id')
    })
  },

  @computed('activity.task')
  ready(task) {
    return Boolean(task && task.get('content'))
  },

  @computed('ready', 'activity.active')
  recording(ready, active) {
    return ready && active
  },

  @computed('ready', 'activity.isNew')
  paused(ready, isNew) {
    return ready && !isNew
  },

  actions: {
    async setCustomer(customer) {
      await this.get('store').query('project', { customer: customer.get('id') })

      this.set('customer',      customer)
      this.set('project',       null)
      this.set('activity.task', null)
    },

    async setProject(project) {
      await this.get('store').query('task', { project: project.get('id') })

      this.set('project',       project)
      this.set('activity.task', null)
    },

    setTask(task) {
      this.set('task', task)
    },

    start() {
      this.get('tracking').startActivity()
    },
    pause() {
      this.get('tracking').stopActivity()
    },
    stop() {
      this.get('tracking').stopActivity()
      this.get('tracking').newActivity()
    },
  }
})
