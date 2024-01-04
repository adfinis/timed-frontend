import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { dropTask } from "ember-concurrency";
import ReportValidations from "timed/validations/report";

export default class ReportRowComponent extends Component {
  @service abilities;

  ReportValidations = ReportValidations;

  get editable() {
    return this.abilities.can("edit report", this.args.report);
  }

  get title() {
    return this.editable
      ? ""
      : `This entry was already verified by ${this.args.report.get(
          "verifiedBy.fullName"
        )} and therefore not editable anymore`;
  }

  /**
   * Save the row
   *
   * @method save
   * @public
   */
  @dropTask
  *save(changeset) {
    if (this.args.onSave) {
      yield this.args.onSave(changeset);
    }
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

  @action
  updateTask(cs, task) {
    cs.task = task;
    cs.remainingEffort = task?.mostRecentRemainingEffort;
  }
}
