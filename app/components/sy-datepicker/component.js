import Component from "@ember/component";
import { computed } from "@ember/object";
import { scheduleOnce } from "@ember/runloop";
import moment from "moment";

const DISPLAY_FORMAT = "DD.MM.YYYY";

const PARSE_FORMAT = "D.M.YYYY";

const parse = (value) => (value ? moment(value, PARSE_FORMAT) : null);

export default Component.extend({
  value: null,

  placeholder: DISPLAY_FORMAT,

  displayValue: computed("value", function () {
    const value = this.get("value");
    return value && value.isValid() ? value.format(DISPLAY_FORMAT) : null;
  }),

  name: "date",

  actions: {
    handleBlur(dd, e) {
      const container = document.getElementById(
        `ember-basic-dropdown-content-${dd.uniqueId}`
      );

      if (!container || !container.contains(e.relatedTarget)) {
        dd.actions.close();
      }
    },

    handleFocus(dd) {
      dd.actions.open();
    },

    checkValidity() {
      scheduleOnce("afterRender", this, this.deferredWork);
    },

    deferredWork() {
      const target = this.get("element").querySelector(
        ".ember-basic-dropdown-trigger input"
      );

      const parsed = parse(target.value);

      if (parsed && !parsed.isValid()) {
        return target.setCustomValidity("Invalid date");
      }

      return target.setCustomValidity("");
    },

    handleChange({
      target: {
        value,
        validity: { valid },
      },
    }) {
      if (valid) {
        const parsed = parse(value);

        return this.get("on-change")(
          parsed && parsed.isValid() ? parsed : null
        );
      }
    },
  },
});
