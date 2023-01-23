import Model, { attr, belongsTo } from "@ember-data/model";

export default class ProjectStatistics extends Model {
  @attr name;
  @attr("django-duration") duration;
  @belongsTo("customer") customer;
}
