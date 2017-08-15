/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route from 'ember-route'
import service from 'ember-service/inject'
import moment from 'moment'

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
   * The tracking service
   *
   * @property {TrackingService} tracking
   * @public
   */
  tracking: service('tracking'),

  /**
   * The actions for the index activities route
   *
   * @property {Object} actions
   * @public
   */
  actions: {
    /**
     * Edit the clicked activity or exit the edit mask if the activity is
     * already being edited.
     *
     * @method editActivity
     * @param {Activity} activity The activity to edit
     * @public
     */
    editActivity(activity) {
      let { id } = this.paramsFor('index.activities.edit')

      if (id === activity.get('id')) {
        this.transitionTo('index.activities')
      } else {
        this.transitionTo('index.activities.edit', activity.get('id'))
      }
    },

    /**
     * Start an activity
     *
     * @method startActivity
     * @param {Activity} activity The activity to start
     * @public
     */
    async startActivity(activity) {
      if (!activity.get('start').isSame(moment(), 'day')) {
        activity = this.store.createRecord('activity', {
          ...activity.getProperties('task', 'comment')
        })
      }

      await this.get('tracking.stopActivity').perform()

      this.set('tracking.activity', activity)

      await this.get('tracking.startActivity').perform()

      this.transitionTo('index.activities', {
        queryParams: { day: moment().format('YYYY-MM-DD') }
      })
    },

    /**
     * Stop an activity
     *
     * @method stopActivity
     * @param {Activity} activity The activity to stop
     * @public
     */
    stopActivity(activity) {
      this.set('tracking.activity', activity)

      this.get('tracking.stopActivity').perform()
    },

    /**
     * Checks if warning concerning unknown tasks should be displayed
     *
     * @method generateReportsCheck
     * @public
     */
    generateReportsCheck() {
      let hasUnknown = !!this.get('controller.activities').findBy(
        'task.id',
        undefined
      )
      let hasOverlapping = !!this.get('controller.activities').findBy(
        'overlaps'
      )

      this.set('controller.showUnknownWarning', hasUnknown)
      this.set('controller.showOverlappingWarning', hasOverlapping)

      if (!hasUnknown && !hasOverlapping) {
        this.send('generateReports')
      }
    },

    /**
     * Generates reports from the current list of activities
     *
     * @method generateReports
     * @public
     */
    async generateReports() {
      this.set('controller.showUnknownWarning', false)
      this.set('controller.showOverlappingWarning', false)

      try {
        await this.get('controller.activities')
          .filter(a => a.get('task.id') && !a.get('overlaps'))
          .forEach(async activity => {
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

            let report = this.store.peekAll('report').find(r => {
              return r.get('activity.id') == activity.get('id')
            })

            if (report) {
              report.setProperties(data)
            } else {
              report = this.store.createRecord('report', data)
            }

            await report.save()
          })

        this.transitionTo('index.reports')
      } catch (e) {
        /* istanbul ignore next */
        this.get('notify').error('Error while generating reports')
      }
    }
  }
})
