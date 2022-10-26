/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from "@ember/component";
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
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
const ReportRowComponent = Component.extend({
  can: service(),

  /**
   * The element tag name
   *
   * @property {String} tagName
   * @public
   */
  tagName: "form",

  /**
   * CSS class names
   *
   * @property {String[]} classNames
   * @public
   */
  classNames: ["form-list-row"],

  attributeBindings: ["title"],

  editable: computed("report.{verifiedBy,billed}", {
    get() {
      return this.can.can("edit report", this.report);
    }
  }),

  title: computed("editable", function() {
    return this.editable
      ? ""
      : `This entry was already verified by ${this.get(
          "report.verifiedBy.fullName"
        )} and therefore not editable anymore`;
  }),

  /**
   * The changeset to edit
   *
   * @property {EmberChangeset.Changeset} changeset
   * @public
   */
  changeset: computed("report.{id,verifiedBy}", function() {
    const c = new Changeset(
      this.report,
      lookupValidator(ReportValidations),
      ReportValidations
    );

    c.validate();

    return c;
  }),

  actions: {
    /**
     * Save the row
     *
     * @method save
     * @public
     */
    save() {
      this["on-save"](this.changeset);
    },

    /**
     * Delete the row
     *
     * @method delete
     * @public
     */
    delete() {
      this["on-delete"](this.report);
    }
  }
});

ReportRowComponent.reopenClass({
  positionalParams: ["report"]
});

export default ReportRowComponent;
