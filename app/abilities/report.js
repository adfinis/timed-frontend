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
        this.user?.isSuperuser ||
        (!this.model?.verifiedBy?.get("id") &&
          // eslint-disable-next-line ember/no-get
          (this.model?.user?.get("id") === this.user?.get("id") ||
            // eslint-disable-next-line ember/no-get
            (this.model?.user?.get("supervisors") ?? [])
              .mapBy("id")
              .includes(this.user?.get("id"))));
      const isReviewer =
        (this.model?.taskAssignees ?? [])
          .concat(
            this.model?.projectAssignees ?? [],
            this.model?.customerAssignees ?? []
          )
          .mapBy("user.id")
          .includes(this.user?.get("id")) && !this.model?.verifiedBy?.get("id");
      return isEditable || isReviewer;
    }
  ),
});
