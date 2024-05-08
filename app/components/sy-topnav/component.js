import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class SyTopnav extends Component {
  @service currentUser;

  @service media;

  @tracked expand = false;

  get navMobile() {
    return this.media.isMo || this.media.isXs || this.media.isSm;
  }
}
