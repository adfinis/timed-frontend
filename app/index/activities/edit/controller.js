/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import lookupValidator from "ember-changeset-validations";
import ActivityValidator from "timed/validations/activity";

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

  validator = ActivityValidator;
  validationMap = lookupValidator(ActivityValidator);

  @action
  validateChangeset(changeset) {
    changeset.validate();
  }

  @action
  toggleValue(changeset, propertyName) {
    changeset[propertyName] = !changeset[propertyName];
  }

  @action
  updateValue(changeset, propertyName, event) {
    changeset[propertyName] = event.target.value;
  }

  @action
  async delete() {
    /* istanbul ignore next */
    if (this.router.currentRoute.active) {
      // We can't test this because the UI already prevents this by disabling
      // the save button..

      this.notify.error("You can't delete an active activity");

      return;
    }

    try {
      await this.model.destroyRecord();

      this.notify.success("Activity was deleted");

      this.router.transitionTo("index.activities");
    } catch (e) {
      /* istanbul ignore next */
      this.notify.error("Error while deleting the activity");
    }
  }

  @action
  async save(changeset, event) {
    event.preventDefault();

    /* istanbul ignore next */
    if (!changeset.isDirty && !changeset.isValid) {
      /* UI prevents this, but could be executed by pressing enter */
      return;
    }

    try {
      await changeset.save();

      this.notify.success("Activity was saved");

      this.router.transitionTo("index.activities");
    } catch (e) {
      /* istanbul ignore next */
      this.notify.error("Error while saving the activity");
    }
  }
}
