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
        (!this.model.verifiedBy?.id &&
          // eslint-disable-next-line ember/no-get
          (this.get("model.user.id") === this.user?.id ||
            // eslint-disable-next-line ember/no-get
            (this.get("model.user.supervisors") ?? [])
              .mapBy("id")
              .includes(this.user?.id)));
      const isReviewer =
        (this.model?.taskAssignees ?? [])
          .concat(
            this.model?.projectAssignees ?? [],
            this.model?.customerAssignees ?? []
          )
          .mapBy("user.id")
          .includes(this.user?.id) && !this.model.verifiedBy?.id;
      return isEditable || isReviewer;
    }
  ),
});
