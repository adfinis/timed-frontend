/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import { action } from "@ember/object";
import { guidFor } from "@ember/object/internals";
import Component from "@glimmer/component";

/**
 * Component for an adcssy styled checkbox
 *
 * @class SyCheckboxComponent
 * @extends Ember.Component
 * @public
 */
export default class SyCheckbox extends Component {
  constructor(...args) {
    super(...args);

    this._checkboxElementId = guidFor(this);
  }

  get checkboxElementId() {
    return this._checkboxElementId;
  }

  @action
  handleCheckBox(element) {
    if (this.args.checked === null) {
      element.indeterminate = true;
    }
  }
}
