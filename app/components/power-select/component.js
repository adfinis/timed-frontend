import { isBlank } from "@ember/utils";
import Ember from "ember";
import PowerSelectComponent from "ember-power-select/components/power-select";

export default class PowerSelectCustomComponent extends PowerSelectComponent {
  constructor(...args) {
    super(...args);

    this.extra = this.extra === undefined ? {} : this.extra;
    // this.extra.testing = Ember.testing;
  }

  _handleKeyTab(...args) {
    this._handleKeyEnter(...args);
  }

  _focusComesFromOutside(e) {
    const blurredEl = e.relatedTarget;

    if (isBlank(blurredEl) || Ember.testing) {
      return false;
    }

    return !blurredEl.classList.contains("ember-power-select-search-input");
  }
}
