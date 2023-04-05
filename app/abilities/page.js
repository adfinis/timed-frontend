import { computed } from "@ember/object";
import { Ability } from "ember-can";

export default Ability.extend({
  canAccess: computed(
    "user.{activeEmployment.isExternal,isReviewer}",
    function () {
      if (!this.user) {
        return false;
      }
      return (
        !this.user.activeEmployment.isExternal ||
        (this.user.activeEmployment.isExternal && this.user.isReviewer)
      );
    }
  ),
});
