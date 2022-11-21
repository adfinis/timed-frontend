import Model, { attr } from "@ember-data/model";

export default Model.extend({
  year: attr("number"),
  month: attr("number"),
  duration: attr("django-duration"),
});
