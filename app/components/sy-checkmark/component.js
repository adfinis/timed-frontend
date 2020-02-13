import { computed } from "@ember/object";
import FaIconComponent from "ember-font-awesome/components/fa-icon";

export default FaIconComponent.extend({
  checked: false,

  icon: computed("checked", function() {
    return this.get("checked") ? "check-square-o" : "square-o";
  })
});
