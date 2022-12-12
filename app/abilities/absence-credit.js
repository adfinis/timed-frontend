import { reads } from "@ember/object/computed";
import { Ability } from "ember-can";

const AbsenceCreditAbility = Ability.extend({
  canEdit: reads("user.isSuperuser"),
  canCreate: reads("user.isSuperuser"),
});

export default AbsenceCreditAbility;
