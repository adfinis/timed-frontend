import Model, { attr } from "@ember-data/model";

export default class YearStatistic extends Model {
  @attr("number") year;
  @attr("django-duration") duration;
}
