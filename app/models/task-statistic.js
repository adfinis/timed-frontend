import Model, { attr, belongsTo } from "@ember-data/model";

export default Model.extend({
  duration: attr("django-duration"),
  task: belongsTo("task"),
});
