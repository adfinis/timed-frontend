import { inject as service } from "@ember/service";
import { Ability } from "ember-can";

export default class PageAbility extends Ability {
  @service session;

  get user() {
    return this.session.data.user;
  }
  get canAccess() {
    if (!this.user) {
      return false;
    }

    return !this.user.activeEmployment?.isExternal || this.user.isReviewer;
  }
}
