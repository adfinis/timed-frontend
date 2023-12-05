import { action } from "@ember/object";
import { guidFor } from "@ember/object/internals";
import { scheduleOnce } from "@ember/runloop";
import { isTesting, macroCondition } from "@embroider/macros";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import moment from "moment";

const DISPLAY_FORMAT = "DD.MM.YYYY";

const PARSE_FORMAT = "D.M.YYYY";

const parse = (value) => (value ? moment(value, PARSE_FORMAT) : null);

export default class SyDatepicker extends Component {
  placeholder = DISPLAY_FORMAT;

  @tracked center;

  constructor(...args) {
    super(...args);

    this.uniqueId = guidFor(this);
    this.center = this.args.value ?? moment();
  }

  get displayValue() {
    return this.args.value && this.args.value.isValid()
      ? this.args.value.format(DISPLAY_FORMAT)
      : null;
  }

  @action
  handleFocus(dd) {
    if (macroCondition(isTesting())) {
      dd.actions.open();
    }
  }

  @action
  handleBlur(dd, e) {
    const container = document.getElementById(
      `ember-basic-dropdown-content-${dd.uniqueId}`
    );

    if (!container || !container.contains(e.relatedTarget)) {
      dd.actions.close();
    }
  }

  @action
  checkValidity() {
    scheduleOnce("afterRender", this, this.deferredWork);
  }

  @action
  deferredWork() {
    const target = document.getElementById(this.uniqueId);

    const parsed = parse(target.value);

    if (parsed && !parsed.isValid()) {
      return target.setCustomValidity("Invalid date");
    }

    return target.setCustomValidity("");
  }

  @action
  handleChange({
    target: {
      value,
      validity: { valid },
    },
  }) {
    if (valid) {
      const parsed = parse(value);

      return this.args.onChange(parsed && parsed.isValid() ? parsed : null);
    }
  }

  @action
  updateCenter({ moment }) {
    this.center = moment;
  }

  @action
  updateSelect(dd, { moment }) {
    (dd.actions.close ?? (() => {}))();
    this.args.onChange(moment);
    this.checkValidity();
  }

  @action
  clear(dd) {
    dd.actions.close();

    this.args.onChange(null);
  }
}
