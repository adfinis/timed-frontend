import Component from "@ember/component";

export default Component.extend({
  tagName: "span",
  classNames: ["color-info"],
  attributeBindings: ["title"],
  title: "Not all of the provided values are identical"
});
