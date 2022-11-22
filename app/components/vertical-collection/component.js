import VerticalCollectionComponent from "@html-next/vertical-collection/components/vertical-collection/component";
import classic from "ember-classic-decorator";
import { isTesting, macroCondition } from "@embroider/macros";

@classic
export default class VerticalCollection extends VerticalCollectionComponent {
  init(...args) {
    super.init(...args);

    if (macroCondition(isTesting())) {
      this.renderAll = true;
    }
  }
}
