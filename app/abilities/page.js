import { computed } from "@ember/object";
import { Ability } from "ember-can";

export default Ability.extend({
  canAccess: computed(
    "user.{activeEmployment.isExternal,isReviewer}",
    function() {
      return (
        !this.get("user.activeEmployment.isExternal") ||
        (this.get("user.activeEmployment.isExternal") &&
          this.get("user.isReviewer"))
      );
    }
  )
});
