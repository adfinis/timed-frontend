import Model, { attr, belongsTo } from "@ember-data/model";

export default Model.extend({
  date: attr("django-date"),
  duration: attr("django-duration"),
  comment: attr("string", { defaultValue: "" }),
  user: belongsTo("user"),
});
