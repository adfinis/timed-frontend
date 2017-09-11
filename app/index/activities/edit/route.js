/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route from 'ember-route'
import service from 'ember-service/inject'
import Changeset from 'ember-changeset'
import lookupValidator from 'ember-changeset-validations'
import ActivityValidator from 'timed/validations/activity'
import RouteAutostartTourMixin from 'timed/mixins/route-autostart-tour'
import ActivityBlockValidator from 'timed/validations/activity-block'
import EmberObject from 'ember-object'
import { oneWay } from 'ember-computed-decorators'
import RSVP from 'rsvp'

const changesetFromBlock = block => {
  let changeset = new Changeset(
    block,
    lookupValidator(ActivityBlockValidator),
    ActivityBlockValidator
  )

  changeset.validate()

  return EmberObject.create({
    changeset,
    model: block,
    @oneWay('model.isDeleted') isDeleted: false,
    @oneWay('changeset.isValid') isValid: false,
    @oneWay('changeset.isDirty') isDirty: false,
    @oneWay('changeset.from') from: null,
    @oneWay('changeset.to') to: null
  })
}

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

    let activity = new Changeset(
      model,
      lookupValidator(ActivityValidator),
      ActivityValidator
    )

    activity.validate()

    let blocks = model
      .get('blocks')
      .sortBy('id')
      .map(changesetFromBlock)

    controller.setProperties({ activity, blocks })
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
      let newBlock = this.store.createRecord('activity-block', {
        activity: this.get('currentModel')
      })

      this.get('controller.blocks').pushObject(changesetFromBlock(newBlock))
    },

    /**
     * Delete a certain activity block
     *
     * This only sets the `isDeleted` flag, so the block is only really deleted
     * after saving the activity.
     *
     * @method deleteBlock
     * @param {Object} block The block (changeset and model) to delete
     * @public
     */
    deleteBlock(block) {
      let { changeset, model } = block

      changeset.rollback()
      model.deleteRecord()

      if (!model.get('id')) {
        this.get('controller.blocks').removeObject(block)
      }
    },

    /**
     * Save the activity and the related edited blocks
     *
     * @method save
     * @public
     */
    async save() {
      /* istanbul ignore next */
      if (!this.get('controller.saveEnabled')) {
        /* UI prevents this, but could be executed by pressing enter */
        return
      }

      try {
        await RSVP.all(
          this.get('controller.blocks')
            .filter(({ changeset, model }) => {
              return changeset.get('isDirty') || model.get('isDeleted')
            })
            .map(async ({ changeset }) => {
              await changeset.save()
            })
        )

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
