import Model, { attr, belongsTo } from "@ember-data/model";

export default class OvertimeCredit extends Model {
  @attr("django-date") date;
  @attr("django-duration") duration;
  @attr("string", { defaultValue: "" }) comment;
  @belongsTo("user") user;
}
