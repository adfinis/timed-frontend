import { computed } from "@ember/object";
import { Ability } from "ember-can";

export default Ability.extend({
  canEdit: computed(
    "user.{id,isSuperuser}",
    "model.{user.id,user.supervisors,verifiedBy,billed,taskAssignees,projectAssignees,customerAssignees}",
    function() {
      const isEditable =
        this.get("user.isSuperuser") ||
        (!(this.get("model.verifiedBy.id") && this.get("model.billed")) &&
          (this.get("model.user.id") === this.get("user.id") ||
            (this.get("model.user.supervisors") ?? [])
              .mapBy("id")
              .includes(this.get("user.id"))));
      const isReviewer = (this.get("model.taskAssignees") ?? [])
        .concat(
          this.get("model.projectAssignees") ?? [],
          this.get("model.customerAssignees") ?? []
        )
        .mapBy("user.id")
        .includes(this.get("user.id"));
      return isEditable || isReviewer;
    }
  )
});
