import Component from 'ember-component'

import computed, {
  alias
} from 'ember-computed-decorators'

export default Component.extend({
  customers: [],
  projects: [],
  tasks: [],

  _customer: null,
  _project: null,
  _task: null,

  @computed('activity.task')
  customer: {
    get(task) {
      if (task) {
        return task.get('project.customer')
      }

      return this.get('_customer')
    },
    set(value) {
      this.set('_customer', value)
      this.set('_project', null)
      this.set('_task', null)

      return value
    }
  },

  @computed('activity.task')
  project: {
    get(task) {
      if (task) {
        return task.get('project')
      }

      return this.get('_project')
    },
    set(value) {
      this.set('_project', value)
      this.set('_task', null)

      return value
    }
  },

  @alias('activity.task')
  task: null,

  @alias('customers')
  _customers: [],

  @computed('projects.[]', 'customer.id')
  _projects(projects, id) {
    if (!id) {
      return []
    }

    return projects.filterBy('customer.id', id)
  },

  @computed('tasks.[]', 'project.id')
  _tasks(tasks, id) {
    if (!id) {
      return []
    }

    return tasks.filterBy('project.id', id)
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
    start() {
      this.attrs['on-start'](this.get('activity'))
    },

    pause() {
      this.attrs['on-pause'](this.get('activity'))
    },

    stop() {
      this.attrs['on-stop'](this.get('activity'))
    }
  }
})
