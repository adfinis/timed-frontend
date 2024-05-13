import { inject as service } from "@ember/service";
import { Ability } from "ember-can";

export default class UserAbility extends Ability {
  @service currentUser;

  get user() {
    return this.currentUser.user;
  }

  get canRead() {
    return (
      this.user?.isSuperuser ||
      this.user?.id === this.model.id ||
      this.model.supervisors.mapBy("id").includes(this.user?.id)
    );
  }
}
