import Model, { attr, belongsTo } from "@ember-data/model";
import moment from "moment";

export default class TaskStatistics extends Model {
  @attr name;
  @attr("django-duration") duration;
  @attr("django-duration", { defaultValue: () => moment.duration() })
  estimatedTime;
  @attr("django-duration") mostRecentRemainingEffort;
  @belongsTo("project") project;
}
