import Model, { attr } from "@ember-data/model";

export default class CustomerStatistics extends Model {
  @attr("django-duration") duration;
  @attr name;
}
