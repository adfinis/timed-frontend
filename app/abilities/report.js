import { computed } from "@ember/object";
import { Ability } from "ember-can";

export default Ability.extend({
  canEdit: computed(
    "user.{id,isSuperuser}",
    "model.{user.id,user.supervisors,verifiedBy,billed,taskAssignees,projectAssignees,customerAssignees}",
    function() {
      const isReviewer =
        (this.get("model.taskAssignees")
          .mapBy("user.id")
          .includes(this.get("user.id")) &&
          this.get("model.taskAssignees")
            .mapBy("isReviewer")
            .includes(true)) ||
        (this.get("model.projectAssignees")
          .mapBy("user.id")
          .includes(this.get("user.id")) &&
          this.get("model.projectAssignees")
            .mapBy("isReviewer")
            .includes(true)) ||
        (this.get("model.customerAssignees")
          .mapBy("user.id")
          .includes(this.get("user.id")) &&
          this.get("model.customerAssignees")
            .mapBy("isReviewer")
            .includes(true));
      const result =
        this.get("user.isSuperuser") ||
        (!(this.get("model.verifiedBy.id") && this.get("model.billed")) &&
          (this.get("model.user.id") === this.get("user.id") ||
            this.getWithDefault("model.user.supervisors", [])
              .mapBy("id")
              .includes(this.get("user.id")) ||
            isReviewer));
      return result;
    }
  )
});
