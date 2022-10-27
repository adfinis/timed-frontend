/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import { classNames } from "@ember-decorators/component";
import Component from "@ember/component";
import { computed } from "@ember/object";
import { scheduleOnce } from "@ember/runloop";
import classic from "ember-classic-decorator";

/**
 * Component for an adcssy styled checkbox
 *
 * @class SyCheckboxComponent
 * @extends Ember.Component
 * @public
 */
@classic
@classNames("checkbox")
export default class SyCheckbox extends Component {
  @computed("elementId")
  get checkboxElementId() {
    return `${this.elementId}-checkbox`;
  }

  didReceiveAttrs() {
    scheduleOnce("afterRender", this, this.deferredWork);
  }

  deferredWork() {
    if (this.checked === null) {
      const cb = this.element.querySelector(`#${this.checkboxElementId}`);

      cb.indeterminate = true;
    }
  }

  /**
   * Action to call if the checked state has changed
   *
   * @method on-change
   * @public
   */
  "on-change"() {}

  /**
   * The label of the checkbox
   *
   * @property {String} label
   * @public
   */
  label = "";

  /**
   * Whether the checkbox is checked
   *
   * @property {Boolean} checked
   * @public
   */
  checked = false;

  /**
   * Whether the checkbox is disabled
   *
   * @property {Boolean} disabled
   * @public
   */
  disabled = false;
}
