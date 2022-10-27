import classic from "ember-classic-decorator";
import VerticalCollectionComponent from "@html-next/vertical-collection/components/vertical-collection/component";
import Ember from "ember";

@classic
export default class VerticalCollection extends VerticalCollectionComponent {
  init(...args) {
    super.init(...args);
    this.set("renderAll", Ember.testing);
  }
}
