/**
 * @module timed
 * @submodule timed-components
 * @public
 */

import { action } from "@ember/object";
import SyDatepickerComponent from "timed/components/sy-datepicker/component";
import { localCopy } from "tracked-toolbox";

/**
 * The sy datepicker btn component
 *
 * @class SyDatepickerBtnComponent
 * @extends SyDatepickerComponent
 * @public
 */
export default class SyDatepickerBtnComponent extends SyDatepickerComponent {
  @localCopy("args.current") center;

  @action
  updateCenter({ moment }) {
    this.center = moment;
  }

  @action
  updateSelection({ moment }) {
    this.args.onChange(moment);
  }
}
