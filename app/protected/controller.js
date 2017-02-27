/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from 'ember-controller'
import computed   from 'ember-computed-decorators'
import service    from 'ember-service/inject'
import moment     from 'moment'

/**
 * The protected controller
 *
 * @class ProtectedController
 * @extends Ember.Controller
 * @public
 */
export default Controller.extend({
  /**
   * The notify service
   *
   * @property {EmberNotify.NotifyService} notify
   * @public
   */
  notify: service('notify'),

  /**
   * Init hook, get or create the current activity
   *
   * @method init
   * @public
   */
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

  /**
   * All customers
   *
   * @property {Customer[]} customers
   * @public
   */
  @computed
  customers() {
    return this.store.peekAll('customer')
  },

  /**
   * All projects
   *
   * @property {Project[]} projects
   * @public
   */
  @computed
  projects() {
    return this.store.peekAll('project')
  },

  /**
   * All tasks
   *
   * @property {Task[]} tasks
   * @public
   */
  @computed
  tasks() {
    return this.store.peekAll('task')
  },

  /**
   * The current activity
   *
   * @property {Activity} currentActivity
   * @public
   */
  currentActivity: null,

  /**
   * Start an activity
   *
   * @method _startActivity
   * @param {Activity} activity The activity to start
   * @public
   */
  async _startActivity(activity) {
    if (activity.get('active')) {
      return
    }

    try {
      if (activity.get('isNew')) {
        await activity.save()
      }

      let block = this.store.createRecord('activity-block', { activity })

      await block.save()

      this.get('notify').success('Activity was started')
    }
    catch(e) {
      /* istanbul ignore next */
      this.get('notify').error('Error while starting the activity')
    }
  },

  /**
   * Stop an activity
   *
   * @method _stopActivity
   * @param {Activity} activity The activity to stop
   * @public
   */
  async _stopActivity(activity) {
    if (!activity.get('active')) {
      return
    }

    try {
      let block = await activity.get('activeBlock')

      if (block) {
        block.set('to', moment())

        await block.save()
      }

      this.set('currentActivity', this.store.createRecord('activity'))

      this.get('notify').success('Activity was stopped')
    }
    catch(e) {
      /* istanbul ignore next */
      this.get('notify').error('Error while stopping the activity')
    }
  },

  /**
   * The actions for the protected controller
   *
   * @property {Object} actions
   * @public
   */
  actions: {
    /**
     * Start the current activity
     *
     * @method startCurrentActivity
     * @public
     */
    startCurrentActivity() {
      this._startActivity(this.get('currentActivity'))
    },

    /**
     * Stop the currentactivity
     *
     * @method stopCurrentActivity
     * @public
     */
    stopCurrentActivity() {
      this._stopActivity(this.get('currentActivity'))
    }
  }
})
