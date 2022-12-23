import { reads } from "@ember/object/computed";
import { Ability } from "ember-can";

const OvertimeCreditAbility = Ability.extend({
  canEdit: reads("user.isSuperuser"),
  canCreate: reads("user.isSuperuser"),
});

export default OvertimeCreditAbility;
