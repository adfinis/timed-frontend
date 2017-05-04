/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route   from 'ember-route'
import service from 'ember-service/inject'
import moment  from 'moment'

/**
 * The index activities route
 *
 * @class IndexActivitiesRoute
 * @extends Ember.Route
 * @public
 */
export default Route.extend({
  /**
   * The notify service
   *
   * @property {EmberNotify.NotifyService} notify
   * @public
   */
  notify: service('notify'),

  /**
   * The actions for the index activities route
   *
   * @property {Object} actions
   * @public
   */
  actions: {
    /**
     * Start an activity
     *
     * @method startActivity
     * @param {Activity} activity The activity to start
     * @public
     */
    async startActivity(activity) {
      let controller = this.controllerFor('protected')

      if (controller.get('currentActivity.active')) {
        await controller._stopActivity(controller.get('currentActivity'))
      }

      controller.set('currentActivity', activity)

      controller.send('startCurrentActivity')
    },

    /**
     * Stop an activity
     *
     * @method stopActivity
     * @param {Activity} activity The activity to stop
     * @public
     */
    stopActivity(activity) {
      let controller = this.controllerFor('protected')

      controller.set('currentActivity', activity)

      controller.send('stopCurrentActivity')
    },

    /**
     * Save an activity
     *
     * @method saveActivity
     * @param {Activity} activity The activity to save
     * @public
     */
    async saveActivity(activity) {
      try {
        await activity.save()

        this.get('notify').success('Activity was saved')
      }
      catch(e) {
        /* istanbul ignore next */
        this.get('notify').error('Error while saving the activity')
      }
    },

    /**
     * Delete an activity
     *
     * @method deleteActivity
     * @param {Activity} activity The activity to delete
     * @public
     */
    async deleteActivity(activity) {
      if (activity.get('active')) {
        /* istanbul ignore next */
        this.get('notify').error('You can\'t delete a currently active activity')
        return
      }

      try {
        await activity.destroyRecord()

        this.get('notify').success('Activity was deleted')
      }
      catch(e) {
        /* istanbul ignore next */
        this.get('notify').error('Error while deleting the activity')
      }
    },

    /**
     * Generates reports from the current list of activities
     *
     * @method generateReports
     * @public
     */
    async generateReports() {
      try {
        await this.get('controller.activities').filterBy('task.id').forEach(async(activity) => {
          let duration = moment.duration(activity.get('duration'))

          if (activity.get('active')) {
            duration.add(moment().diff(activity.get('activeBlock.from')))
          }

          let data = {
            activity,
            duration,
            date: activity.get('start'),
            task: activity.get('task'),
            comment: activity.get('comment')
          }

          let report = this.store.peekAll('report').find((r) => {
            return r.get('activity.id') == activity.get('id')
          })

          if (report) {
            report.setProperties(data)
          }
          else {
            report = this.store.createRecord('report', data)
          }

          await report.save()
        })

        this.transitionTo('index.reports')
      }
      catch(e) {
        /* istanbul ignore next */
        this.get('notify').error('Error while generating reports')
      }
    }
  }
})
