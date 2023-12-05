import Model, { attr } from "@ember-data/model";

export default class MonthStatistic extends Model {
  @attr("number") year;
  @attr("number") month;
  @attr("django-duration") duration;
}
