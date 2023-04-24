import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

export default class LoginController extends Controller {
  @service router;

  @action
  ssoLogin() {
    this.router.transitionTo("sso-login");
  }
}
