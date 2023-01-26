import Model, { attr, belongsTo } from "@ember-data/model";

export default class ProjectStatistics extends Model {
  @attr name;
  @attr("django-duration") estimatedTime;
  @attr("django-duration") duration;
  @attr("django-duration") totalRemainingEffort;
  @belongsTo("customer") customer;
}
