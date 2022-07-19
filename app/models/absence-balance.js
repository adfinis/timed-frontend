import Model, { attr, belongsTo, hasMany } from "@ember-data/model";

export default Model.extend({
  credit: attr("number"),
  usedDays: attr("number"),
  usedDuration: attr("django-duration"),
  balance: attr("number"),
  user: belongsTo("user"),
  absenceType: belongsTo("absence-type"),
  absenceCredits: hasMany("absence-credit"),
});
