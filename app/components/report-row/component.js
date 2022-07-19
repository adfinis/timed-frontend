/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import Changeset from "ember-changeset";
import lookupValidator from "ember-changeset-validations";
import { dropTask } from "ember-concurrency";
import ReportValidations from "timed/validations/report";

/**
 * Component for the editable report row
 *
 * @class ReportRowComponent
 * @extends Ember.Component
 * @public
 */
export default class ReportRowComponent extends Component {
  @service abilities;

  @tracked
  changeset;

  constructor(...args) {
    super(...args);

    this.createChangeset.perform();
  }

  get editable() {
    return this.abilities.can("edit report", this.args.report);
  }

  get title() {
    return this.editable
      ? ""
      : `This entry was already verified by ${this.args.report.verifiedBy.fullName} and is therefore not editable anymore`;
  }

  @dropTask
  *createChangeset() {
    const c = new Changeset(
      this.args.report,
      lookupValidator(ReportValidations),
      ReportValidations
    );

    yield c.validate();

    this.changeset = c;
  }

  @action
  updateComment(event) {
    this.changeset.comment = event.target.value;
  }

  @action
  updateTask(task) {
    this.changeset.task = task;
  }

  /**
   * Save the row
   *
   * @method save
   * @public
   */
  @action
  save(event) {
    event.preventDefault();
    this.args.onSave(this.changeset);
  }

  /**
   * Delete the row
   *
   * @method delete
   * @public
   */
  @action
  delete() {
    this.args.onDelete(this.args.report);
  }
}
