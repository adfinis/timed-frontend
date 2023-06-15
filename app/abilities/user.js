import classic from "ember-classic-decorator";
import BaseAbility from "timed/abilities/-base";

// The Ability class is used in a way which triggeres some deprecation error in ember.
// See https://github.com/minutebase/ember-can/issues/157 for further information. This
// decorator should be deleted as soon as ember-can refactors to native classes.
@classic
export default class UserAbility extends BaseAbility {
  get canRead() {
    return (
      this.user?.isSuperuser ||
      this.user?.id === this.model.id ||
      this.model.supervisors.mapBy("id").includes(this.user?.id)
    );
  }
}
