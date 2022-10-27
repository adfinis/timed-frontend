import classic from "ember-classic-decorator";
import { classNames, attributeBindings, tagName } from "@ember-decorators/component";
import { action, computed } from "@ember/object";
import { inject as service } from "@ember/service";
/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from "@ember/component";
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
@classic
@tagName("form")
@classNames("form-list-row")
@attributeBindings("title")
class ReportRowComponent extends Component {
  @service
  can;

  @computed("report.{verifiedBy,billed}")
  get editable() {
    return this.can.can("edit report", this.report);
  }

  @computed("editable")
  get title() {
    return this.editable
      ? ""
      : `This entry was already verified by ${this.get(
          "report.verifiedBy.fullName"
        )} and therefore not editable anymore`;
  }

  /**
   * The changeset to edit
   *
   * @property {EmberChangeset.Changeset} changeset
   * @public
   */
  @computed("report.{id,verifiedBy}")
  get changeset() {
    const c = new Changeset(
      this.report,
      lookupValidator(ReportValidations),
      ReportValidations
    );

    c.validate();

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
    this["on-save"](this.changeset);
  }

  /**
   * Delete the row
   *
   * @method delete
   * @public
   */
  @action
  delete() {
    this["on-delete"](this.report);
  }
}

ReportRowComponent.reopenClass({
  positionalParams: ["report"]
});

export default ReportRowComponent;
