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
   * Start the current activity
   *
   * @method _startCurrentActivity
   * @private
   */
  async _startCurrentActivity() {
    try {
      let activity = this.get('currentActivity')

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
   * Pause the current activity
   *
   * @method _pauseCurrentActivity
   * @private
   */
  async _pauseCurrentActivity() {
    try {
      let activity = this.get('currentActivity')

      let block = await activity.get('activeBlock')

      block.set('to', moment())

      await block.save()

      this.get('notify').success('Activity was paused')
    }
    catch(e) {
      /* istanbul ignore next */
      this.get('notify').error('Error while pausing the activity')
    }
  },

  /**
   * Stop the current activity
   *
   * @method _stopCurrentActivity
   * @private
   */
  async _stopCurrentActivity() {
    try {
      let activity = this.get('currentActivity')

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
     * Set and start an activity
     *
     * @method startActivity
     * @param {Activity} activity The activity to start
     * @public
     */
    startActivity(activity) {
      this.set('currentActivity', activity)
      this._startCurrentActivity(activity)
    },

    /**
     * Set and pause an activity
     *
     * @method pauseActivity
     * @param {Activity} activity The activity to pause
     * @public
     */
    pauseActivity(activity) {
      this.set('currentActivity', activity)
      this._pauseCurrentActivity(activity)
    },

    /**
     * Set and stop an activity
     *
     * @method stopActivity
     * @param {Activity} activity The activity to stop
     * @public
     */
    stopActivity(activity) {
      this.set('currentActivity', activity)
      this._stopCurrentActivity(activity)
    },

    /**
     * Continue an activity
     *
     * First stop the current activity, then start the given
     *
     * @method continueActivity
     * @param {Activity} activity The activity to continue
     * @public
     */
    async continueActivity(activity) {
      if (!this.get('currentActivity.isNew')) {
        await this._stopCurrentActivity()
      }

      this.set('currentActivity', activity)
      this._startCurrentActivity(activity)
    }
  }
})
