import attr from "ember-data/attr";
import Model from "ember-data/model";
import { belongsTo, hasMany } from "ember-data/relationships";

export default Model.extend({
  credit: attr("number"),
  usedDays: attr("number"),
  usedDuration: attr("django-duration"),
  balance: attr("number"),
  user: belongsTo("user"),
  absenceType: belongsTo("absence-type"),
  absenceCredits: hasMany("absence-credit")
});
