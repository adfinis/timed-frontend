import Model, { attr, belongsTo } from "@ember-data/model";

export default class WorktimeBalance extends Model {
  @attr("django-date") date;
  @attr("django-duration") balance;
  @belongsTo("user") user;
}
