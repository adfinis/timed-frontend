import Model, { attr, belongsTo } from "@ember-data/model";

export default Model.extend({
  duration: attr("django-duration"),
  user: belongsTo("user"),
});
