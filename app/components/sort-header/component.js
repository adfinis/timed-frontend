import Component from "@ember/component";
import { computed } from "@ember/object";

const getDirection = state => {
  return state.startsWith("-") ? "desc" : "asc";
};

const getColname = state =>
  state.startsWith("-") ? state.substring(1) : state;

export default Component.extend({
  tagName: "th",

  direction: computed("current", function() {
    return getDirection(this.current);
  }).readOnly(),

  active: computed("current", function() {
    const by = this.by;
    const current = this.current;

    return getColname(current) === by;
  }).readOnly(),

  click() {
    const current = this.current;
    const by = this.by;
    const sort =
      this.active && getDirection(current) === "desc" ? by : `-${by}`;

    this.update(sort);
  }
});
