import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class SyTopnav extends Component {
  @service session;

  @service media;

  @tracked expand = false;

  get navMobile() {
    return this.media.isMo || this.media.isXs || this.media.isSm;
  }

  /**
   * TODO:
   * i don't know if it's an issue in `ember-simple-auth` or `ember-simple-auth-oidc`
   * or it's maybe wrong configration from Timed frontend side,
   * BUT after refreshing the token, the session service is not encapsulating the reslts from keycloak
   * inside ember data model, so i add this small.
   */
  get fullName() {
    const fullName = this.session.data.user?.fullName;
    if (fullName) return fullName;

    if (!this.session.data.user?.attributes) return "";

    const userAttributes = this.session.data.user.attributes;
    return `${userAttributes["first-name"]} ${userAttributes["last-name"]}`;
  }
}
