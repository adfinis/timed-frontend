/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'
import moment from 'moment'
import RSVP from 'rsvp'
import RouteAutostartTourMixin from 'timed/mixins/route-autostart-tour'

/**
 * The index activities route
 *
 * @class IndexActivitiesRoute
 * @extends Ember.Route
 * @public
 */
export default Route.extend(RouteAutostartTourMixin, {
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

  model() {
    return this.modelFor('index')
  },

  /**
   * Setup controller hook, set the current user
   *
   * @method setupController
   * @param {Ember.Controller} controller The controller
   * @public
   */
  setupController(controller) {
    this._super(...arguments)

    controller.set('user', this.modelFor('protected'))
  },

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
      if (!activity.get('transferred')) {
        let { id } = this.paramsFor('index.activities.edit')

        if (id === activity.get('id')) {
          this.transitionTo('index.activities')
        } else {
          this.transitionTo('index.activities.edit', activity.get('id'))
        }
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
      if (!activity.get('date').isSame(moment(), 'day')) {
        activity = this.store.createRecord('activity', {
          ...activity.getProperties('task', 'comment')
        })
      }

      await this.get('tracking.stopActivity').perform()

      this.set('tracking.activity', activity)

      await this.get('tracking.startActivity').perform()

      await this.transitionTo('index.activities', {
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
      let hasOverlapping = !!this.get('controller.sortedActivities').find(a => {
        return a.get('active') && !a.get('from').isSame(moment(), 'day')
      })

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
          .filter(
            a =>
              a.get('task.id') &&
              !(a.get('active') && !a.get('from').isSame(moment(), 'day')) &&
              !a.get('transferred')
          )
          .reduce(async (reducer, activity) => {
            let duration = activity.get('duration')

            if (activity.get('active')) {
              duration.add(moment().diff(activity.get('from')))

              await this.get('tracking.stopActivity').perform()
              this.set('tracking.activity', activity)
              await this.get('tracking.startActivity').perform()
            }

            let data = {
              duration,
              date: activity.get('date'),
              task: activity.get('task'),
              review: activity.get('review'),
              notBillable: activity.get('notBillable'),
              comment: activity.get('comment').trim()
            }

            let report = this.store.peekAll('report').find(r => {
              return (
                (!r.get('user.id') ||
                  r.get('user.id') === activity.get('user.id')) &&
                r.get('date').isSame(data.date, 'day') &&
                r.get('comment').trim() === data.comment &&
                r.get('task.id') === data.task.get('id') &&
                r.get('review') === data.review &&
                r.get('notBillable') === data.notBillable &&
                !r.get('verfiedBy') &&
                !r.get('isDeleted')
              )
            })

            if (report) {
              data.duration.add(report.get('duration'))
              report.set('duration', data.duration)
            } else {
              report = this.store.createRecord('report', data)
            }

            activity.set('transferred', true)

            return reducer
              .then(activity.save.bind(activity))
              .then(report.save.bind(report))
          }, RSVP.resolve())

        await this.transitionTo('index.reports')
      } catch (e) {
        /* istanbul ignore next */
        this.get('notify').error('Error while generating reports')
      }
    }
  }
})
