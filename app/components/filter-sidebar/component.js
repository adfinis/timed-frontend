import Component from "@ember/component";

export default Component.extend({
  tagName: "",

  visible: false,

  didInsertElement(...args) {
    this._super(...args);

    this.set("destination", document.getElementById("filter-sidebar-target"));
  },
});
