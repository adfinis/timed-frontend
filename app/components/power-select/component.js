import { action } from "@ember/object";
import { isBlank } from "@ember/utils";
import Ember from "ember";
import PowerSelectComponent from "ember-power-select/components/power-select";

export default class PowerSelectCustomComponent extends PowerSelectComponent {
  constructor(...args) {
    super(...args);

    this.extra = this.args.extra ?? {};
    this.extra.testing = Ember.testing;
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

  @action
  onTriggerFocus(_, e, ...args) {
    this.super(_, e, ...args);

    if (this._focusComesFromOutside(e)) {
      this.get("publicAPI.actions").open(e);
    }
  }

  @action
  onBlur(e, ...args) {
    this.super(e, ...args);

    if (this._focusComesFromOutside(e)) {
      this.get("publicAPI.actions").close(e);
    }
  }

  @action
  scrollTo() {
    const options = document.querySelector(
      `#ember-power-select-options-${this.publicAPI.uniqueId}`
    );

    const current = options.querySelector("[aria-current=true]");

    if (!current) {
      return;
    }

    const currentScrollY = options.scrollTop;
    const top = current.offsetTop;
    const bottomOfOption = top + current.offsetHeight;

    if (bottomOfOption > currentScrollY + options.offsetHeight) {
      options.scrollTop = bottomOfOption - options.offsetHeight;
    } else if (top < currentScrollY) {
      options.scrollTop = top;
    }
  }
}
