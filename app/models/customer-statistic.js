import Model, { attr, belongsTo } from "@ember-data/model";

export default Model.extend({
  duration: attr("django-duration"),
  customer: belongsTo("customer"),
});
