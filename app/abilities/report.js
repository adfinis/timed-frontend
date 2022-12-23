import { computed } from "@ember/object";
import { Ability } from "ember-can";

export default Ability.extend({
  canEdit: computed(
    // eslint-disable-next-line ember/use-brace-expansion
    "model.user.{id,supervisors}",
    "model.verifiedBy.id",
    "model.{billed,customerAssignees,projectAssignees,taskAssignees}",
    "user.{id,isSuperuser}",
    function () {
      const isEditable =
        this.get("user.isSuperuser") ||
        (!this.get("model.verifiedBy.id") &&
          (this.get("model.user.id") === this.get("user.id") ||
            (this.get("model.user.supervisors") ?? [])
              .mapBy("id")
              .includes(this.get("user.id"))));
      const isReviewer =
        (this.get("model.taskAssignees") ?? [])
          .concat(
            this.get("model.projectAssignees") ?? [],
            this.get("model.customerAssignees") ?? []
          )
          .mapBy("user.id")
          .includes(this.get("user.id")) && !this.get("model.verifiedBy.id");
      return isEditable || isReviewer;
    }
  ),
});
