import VerticalCollectionComponent from "@html-next/vertical-collection/components/vertical-collection/component";
import Ember from "ember";

export default VerticalCollectionComponent.extend({
  init(...args) {
    this._super(...args);
    this.set("renderAll", Ember.testing);
  }
});
