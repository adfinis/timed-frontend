import { inject as service } from "@ember/service";
import { Ability } from "ember-can";

export default class BaseAbility extends Ability {
  @service session;

  get user() {
    return this.session.data?.user;
  }
}
