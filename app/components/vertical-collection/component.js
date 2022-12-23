import { isTesting, macroCondition } from "@embroider/macros";
import VerticalCollectionComponent from "@html-next/vertical-collection/components/vertical-collection/component";
import classic from "ember-classic-decorator";

@classic
export default class VerticalCollection extends VerticalCollectionComponent {
  init(...args) {
    super.init(...args);

    if (macroCondition(isTesting())) {
      this.renderAll = true;
    }
  }
}
