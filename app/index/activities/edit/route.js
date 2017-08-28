/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route from 'ember-route'
import service from 'ember-service/inject'
import moment from 'moment'
import Changeset from 'ember-changeset'
import ActivityValidator from 'timed/validations/activity'
import RouteAutostartTourMixin from 'timed/mixins/route-autostart-tour'

/**
 * Route to edit an activity
 *
 * @class IndexActivitiesEditRoute
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
   * Model hook, fetch the activity to edit
   *
   * @method model
   * @param {Object} params The route params
   * @param {String} params.id The id of the activity to edit
   * @return {Activity} The activity to edit
   * @public
   */
  model({ id }) {
    return this.store.findRecord('activity', id, { include: 'blocks' })
  },

  /**
   * Setup controller hook, generate a changeset from the model
   *
   * @method setupController
   * @param {IndexActivityEditController} controller The controller
   * @param {Activity} model The activity to edit
   * @public
   */
  setupController(controller, model) {
    this._super(...arguments)

    controller.set('activity', new Changeset(model, ActivityValidator))
  },

  /**
   * Actions for the route
   *
   * @property {Object} actions
   * @public
   */
  actions: {
    /**
     * Add a new activity block
     *
     * @method addBlock
     * @public
     */
    addBlock() {
      this.store.createRecord('activity-block', {
        activity: this.get('currentModel'),
        from: moment(),
        to: moment().add(1, 'hour')
      })
    },

    /**
     * Delete a certain activity block
     *
     * This only sets the `isDeleted` flag, so the block is only really deleted
     * after saving the activity.
     *
     * @method deleteBlock
     * @param {ActivityBlock} block The block to delete
     * @public
     */
    deleteBlock(block) {
      block.deleteRecord()
    },

    /**
     * Save the activity and the related edited blocks
     *
     * @method save
     * @public
     */
    async save() {
      try {
        this.get('controller.activity.blocks').forEach(async block => {
          if (block.get('hasDirtyAttributes')) {
            await block.save()
          }
        })

        await this.get('controller.activity').save()

        this.get('notify').success('Activity was saved')

        this.transitionTo('index.activities')
      } catch (e) {
        /* istanbul ignore next */
        this.get('notify').error('Error while saving the activity')
      }
    },

    /**
     * Delete the activity
     *
     * @method delete
     * @public
     */
    async delete() {
      /* istanbul ignore next */
      if (this.get('currentModel.active')) {
        // We can't test this because the UI already prevents this by disabling
        // the save button..

        this.get('notify').error("You can't delete an active activity")

        return
      }

      try {
        await this.get('currentModel').destroyRecord()

        this.get('notify').success('Activity was deleted')

        this.transitionTo('index.activities')
      } catch (e) {
        /* istanbul ignore next */
        this.get('notify').error('Error while deleting the activity')
      }
    }
  }
})
