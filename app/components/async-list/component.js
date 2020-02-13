import Component from "@ember/component";

const AsyncListComponent = Component.extend({
  tagName: ""
});

AsyncListComponent.reopenClass({
  positionalParams: ["data"]
});

export default AsyncListComponent;
