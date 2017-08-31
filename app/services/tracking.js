/**
 * @module timed
 * @submodule timed-services
 * @public
 */
import Ember from 'ember'
import Service from 'ember-service'
import service from 'ember-service/inject'
import moment from 'moment'
import formatDuration from 'timed/utils/format-duration'
import getOwner from 'ember-owner/get'
import { scheduleOnce } from 'ember-runloop'

import computed, { observes } from 'ember-computed-decorators'

import { camelize, capitalize } from 'ember-string'

import { task, timeout } from 'ember-concurrency'

const { testing } = Ember

const zeroIfFalse = bool => (bool ? null : 0)

/**
 * Tracking service
 *
 * This contains some methods, the application needs on multiple routes
 *
 * @class TrackingService
 * @extends Ember.Service
 * @public
 */
export default Service.extend({
  /**
   * The store service
   *
   * @property {Ember.Store} store
   * @public
   */
  store: service('store'),

  /**
   * The notify service
   *
   * @property {EmberNotify.NotifyService} notify
   * @public
   */
  notify: service('notify'),

  /**
   * Init hook, get the current activity
   *
   * @method init
   * @public
   */
  async init() {
    this._super()

    let actives = await this.get('store').query('activity', {
      include: 'blocks,task,task.project,task.project.customer',
      active: true
    })

    this.set('activity', actives.getWithDefault('firstObject', null))

    this.get('_computeTitle').perform()
  },

  /**
   * The application
   *
   * @property {Ember.Application} application
   * @public
   */
  @computed
  application() {
    return getOwner(this).lookup('application:main')
  },

  /**
   * The default application title
   *
   * @property {String} title
   * @public
   */
  @computed('application.name')
  title(name) {
    return capitalize(camelize(name || 'Timed'))
  },

  /**
   * Trigger a reload of the title because the activity has changed
   *
   * @method _triggerTitle
   * @private
   */
  @observes('activity.active')
  _triggerTitle() {
    if (this.get('activity.active')) {
      this.get('_computeTitle').perform()
    } else {
      this.setTitle(this.get('title'))
    }
  },

  /**
   * Set the doctitle
   *
   * @method setTitle
   * @param {String} title The title to set
   * @public
   */
  setTitle(title) {
    scheduleOnce(
      'afterRender',
      this,
      t => {
        document.title = t
      },
      title
    )
  },

  /**
   * Set the title of the application to show the current tracking time and
   * task
   *
   * @method _computeTitle
   * @private
   */
  _computeTitle: task(function*() {
    while (this.get('activity.active')) {
      let elapsed = this.get('activity.duration') || moment.duration()
      let duration = moment.duration(
        moment().diff(this.get('activity.activeBlock.from'))
      )

      let full = moment.duration(elapsed).add(duration)

      let task = 'Unknown Task'

      if (this.get('activity.task.content')) {
        let c = this.get('activity.task.project.customer.name')
        let p = this.get('activity.task.project.name')
        let t = this.get('activity.task.name')

        task = `${c} > ${p} > ${t}`
      }

      this.setTitle(`${formatDuration(full)} (${task})`)

      /* istanbul ignore else */
      if (testing) {
        return
      }

      /* istanbul ignore next */
      yield timeout(1000)
    }
  }),

  /**
   * Returns recently used tasks
   *
   * @property {EmberConcurrency.Task} recentTasks
   * @public
   */
  recentTasks: task(function*(archived) {
    return yield this.get('store').query('task', {
      my_most_frequent: 10, // eslint-disable-line camelcase
      archived: zeroIfFalse(archived),
      include: 'project,project.customer'
    })
  }).restartable(),

  /**
   * Filter all customers
   *
   * @property {EmberConcurrency.Task} filterCustomers
   * @param {Boolean} archived Whether to show archived customer
   * @public
   */
  filterCustomers: task(function*(archived) {
    yield timeout(500)

    return yield this.get('store').query('customer', {
      archived: zeroIfFalse(archived)
    })
  }).restartable(),

  /**
   * Filter all projects by customer
   *
   * @property {EmberConcurrency.Task} filterProjects
   * @param {Number} customer The customer id to filter by
   * @param {Boolean} archived Whether to show archived projects
   * @public
   */
  filterProjects: task(function*(customer, archived) {
    /* istanbul ignore next */
    if (!customer) {
      // We can't test this because the UI prevents it
      throw new Error('No customer selected')
    }

    yield timeout(500)

    return yield this.get('store').query('project', {
      customer,
      archived: zeroIfFalse(archived)
    })
  }).restartable(),

  /**
   * Filter all tasks by project
   *
   * @property {EmberConcurrency.Task} filterTask
   * @param {Number} project The project id to filter by
   * @param {Boolean} archived Whether to show archived tasks
   * @public
   */
  filterTasks: task(function*(project, archived) {
    /* istanbul ignore next */
    if (!project) {
      // We can't test this because the UI prevents it
      throw new Error('No project selected')
    }

    yield timeout(500)

    return yield this.get('store').query('task', {
      project,
      archived: zeroIfFalse(archived)
    })
  }).restartable(),

  /**
   * The current activity
   *
   * @property {Activity} currentActivity
   * @public
   */
  _activity: null,

  /**
   * The currenty activity or create a new one if none is set
   *
   * @property {Activity} activity
   * @public
   */
  @computed
  activity: {
    get() {
      return this.get('_activity')
    },
    set(value) {
      let newActivity = value || this.get('store').createRecord('activity')

      this.set('_activity', newActivity)

      return newActivity
    }
  },

  /**
   * Start the activity
   *
   * @method startActivity
   * @public
   */
  startActivity: task(function*() {
    let activity = this.get('activity')

    /* istanbul ignore next */
    if (activity.get('active')) {
      // We can't test this because the UI prevents it
      return
    }

    try {
      if (activity.get('isNew')) {
        yield activity.save()
      }

      let block = this.get('store').createRecord('activity-block', { activity })

      yield block.save()

      // Sadly, we need to do this here since the computed property
      // 'activeBlock' on the activity does not sense a change when the blocks
      // change from new to actually loaded
      activity.notifyPropertyChange('blocks')

      this.get('notify').success('Activity was started')
    } catch (e) {
      /* istanbul ignore next */
      this.get('notify').error('Error while starting the activity')
    }
  }).drop(),

  /**
   * Stop the activity
   *
   * @method stopActivity
   * @public
   */
  stopActivity: task(function*() {
    let activity = this.get('activity')

    if (!activity.get('active')) {
      return
    }

    try {
      let block = yield activity.get('activeBlock')

      block.set('to', moment())

      yield block.save()

      this.set('activity', null)

      this.get('notify').success('Activity was stopped')
    } catch (e) {
      /* istanbul ignore next */
      this.get('notify').error('Error while stopping the activity')
    }
  }).drop()
})
