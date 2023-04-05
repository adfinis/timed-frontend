/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { timeout } from "ember-concurrency";

/**
 * Controller to edit an activity
 *
 * @class IndexActivitiesEditController
 * @extends Ember.Controller
 * @public
 */
export default class IndexActivitiesEditController extends Controller {
  @service notify;
  @service router;
  @tracked changeset;

  /**
   * Whether the save button is enabled
   *
   * This is true if the activity is valid and there are some
   * changes on the activity
   *
   * @property {Boolean} saveEnabled
   * @public
   */
  get saveEnabled() {
    return this.changeset.isDirty && this.changeset.isValid;
  }

  /**
   * Validate the given changeset
   *
   * @method validateChangeset
   * @param {EmberChangeset.Changeset} changeset The changeset to validate
   * @public
   */
  @action
  validateChangeset() {
    this.changeset.validate();
  }

  @action
  async save(e) {
    e.preventDefault();

    if (!this.saveEnabled) {
      /* UI prevents this, but could be executed by pressing enter */
      return;
    }

    try {
      await this.changeset.save();

      this.notify.success("Activity was saved");

      this.router.transitionTo("index.activities");
    } catch (e) {
      console.error(e);
      this.notify.error("Error while saving the activity");
    }
  }

  /**
   * Delete the activity
   *
   * @method delete
   * @public
   */
  @action
  async delete() {
    if (this.model.active) {
      // We can't test this because the UI already prevents this by disabling
      // the save button..

      this.notify.error("You can't delete an active activity");

      return;
    }

    try {
      let limiter = 0;
      while (limiter++ < 100 && this.model.isSaving) {
        // wait for maximum 5 seconds for saving changes
        // eslint-disable-next-line no-await-in-loop
        await timeout(50);
      }

      await this.model.destroyRecord();

      this.notify.success("Activity was deleted");

      this.router.transitionTo("index.activities");
    } catch (e) {
      console.error(e);
      this.notify.error("Error while deleting the activity");
    }
  }

  @action
  setTask(task) {
    if (task.id !== this.changeset.task.id) {
      this.changeset.task = task;
    }
  }
}
