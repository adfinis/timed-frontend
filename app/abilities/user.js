import { computed } from "@ember/object";
import { Ability } from "ember-can";

export default Ability.extend({
  canRead: computed(
    "user.{id,isSuperuser}",
    "model.{id,supervisors}",
    function () {
      return (
        this.user?.isSuperuser ||
        this.user?.id === this.model.id ||
        this.model.supervisors.mapBy("id").includes(this.user?.id)
      );
    }
  ),
});
