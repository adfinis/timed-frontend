import attr from "ember-data/attr";
import Model from "ember-data/model";

export default Model.extend({
  year: attr("number"),
  duration: attr("django-duration")
});
