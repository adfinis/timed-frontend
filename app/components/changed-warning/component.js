import Component from "@ember/component";

export default Component.extend({
  tagName: "span",
  classNames: ["color-warning"],
  attributeBindings: ["title"],
  title: "This field has unsaved changes",
});
