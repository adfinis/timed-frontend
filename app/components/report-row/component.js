/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import { action } from "@ember/object";
import { later } from "@ember/runloop";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import Changeset from "ember-changeset";
import lookupValidator from "ember-changeset-validations";
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

  get editable() {
    return this.abilities.can("edit report", this.args.report);
  }

  get title() {
    return this.editable
      ? ""
      : `This entry was already verified by ${this.args.report.verifiedBy.fullName} and is therefore not editable anymore`;
  }

  /**
   * The changeset to edit
   *
   * @property {EmberChangeset.Changeset} changeset
   * @public
   */
  get changeset() {
    const c = new Changeset(
      this.args.report,
      lookupValidator(ReportValidations),
      ReportValidations
    );

    later(() => {
      c.validate();
    });

    return c;
  }

  /**
   * Save the row
   *
   * @method save
   * @public
   */
  @action
  save() {
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
