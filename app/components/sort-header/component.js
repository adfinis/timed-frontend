import Component from "@ember/component";
import { computed } from "@ember/object";

const getDirection = (state) => {
  return state.startsWith("-") ? "desc" : "asc";
};

const getColname = (state) =>
  state.startsWith("-") ? state.substring(1) : state;

export default Component.extend({
  tagName: "th",

  direction: computed("current", function () {
    return getDirection(this.get("current"));
  }).readOnly(),

  active: computed("current", function () {
    const by = this.get("by");
    const current = this.get("current");

    return getColname(current) === by;
  }).readOnly(),

  click() {
    const current = this.get("current");
    const by = this.get("by");
    const sort =
      this.get("active") && getDirection(current) === "desc" ? by : `-${by}`;

    this.get("update")(sort);
  },
});
