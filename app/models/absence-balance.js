import Model, { attr, belongsTo, hasMany } from "@ember-data/model";

export default class AbsenceBalance extends Model {
  @attr("number") credit;
  @attr("number") usedDays;
  @attr("django-duration") usedDuration;
  @attr("number") balance;
  @belongsTo("user") user;
  @belongsTo("absence-type") absenceType;
  @hasMany("absence-credit") absenceCredits;
}
