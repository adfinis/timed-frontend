import classic from "ember-classic-decorator";
import BaseAbility from "timed/abilities/-base";

// The Ability class is used in a way which triggeres some deprecation error in ember.
// See https://github.com/minutebase/ember-can/issues/157 for further information. This
// decorator should be deleted as soon as ember-can refactors to native classes.
@classic
export default class ReportAbility extends BaseAbility {
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

  get canBill() {
    return this.user.isAccountant || this.user.isSuperuser;
  }
}
