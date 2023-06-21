import { inject as service } from "@ember/service";
import { Ability } from "ember-can";

export default class OvertimeCreditAbility extends Ability {
  @service session;

  get user() {
    return this.session.data.user;
  }
  get canEdit() {
    return this.user.isSuperuser;
  }
  get canCreate() {
    return this.user.isSuperuser;
  }
}
