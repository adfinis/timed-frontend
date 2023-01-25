import Model, { attr, belongsTo } from "@ember-data/model";

export default class TaskStatistics extends Model {
  @attr name;
  @attr("django-duration") duration;
  @attr("django-duration") estimatedTime;
  @attr("django-duration") mostRecentRemainingEffort;
  @belongsTo("project") project;
}
