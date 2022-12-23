import Model, { attr, belongsTo } from "@ember-data/model";

export default Model.extend({
  date: attr("django-date"),
  balance: attr("django-duration"),
  user: belongsTo("user"),
});
