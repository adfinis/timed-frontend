import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { Ability } from "ember-can";

export default class ReportAbility extends Ability {
  @service session;
  @tracked user;

  constructor(...args) {
    super(...args);
    this.user = this.session.data.user;
  }

  get canEdit() {
    const isEditable =
      this.user?.isSuperuser ||
      (!this.model?.verifiedBy?.get("id") &&
        // eslint-disable-next-line ember/no-get
        (this.model?.user?.get("id") === this.user?.get("id") ||
          // eslint-disable-next-line ember/no-get
          (this.model?.user?.get("supervisors") ?? [])
            .mapBy("id")
            .includes(this.user?.get("id"))));
    const isReviewer =
      (this.model?.taskAssignees ?? [])
        .concat(
          this.model?.projectAssignees ?? [],
          this.model?.customerAssignees ?? []
        )
        .mapBy("user.id")
        .includes(this.user?.get("id")) && !this.model?.verifiedBy?.get("id");
    return isEditable || isReviewer;
  }
}
