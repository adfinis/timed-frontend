import { inject as service } from "@ember/service";
import { Ability } from "ember-can";

export default class PageAbility extends Ability {
  @service currentUser;

  get user() {
    return this.currentUser.user;
  }
  get canAccess() {
    if (!this.user) {
      return false;
    }

    return !this.user.activeEmployment?.isExternal || this.user.isReviewer;
  }
}
