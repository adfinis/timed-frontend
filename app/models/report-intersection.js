import Model, { attr, belongsTo } from "@ember-data/model";

export default Model.extend({
  comment: attr("string"),
  notBillable: attr("boolean", { allowNull: true, defaultValue: null }),
  rejected: attr("boolean", { allowNull: true, defaultValue: null }),
  review: attr("boolean", { allowNull: true, defaultValue: null }),
  billed: attr("boolean", { allowNull: true, defaultValue: null }),
  verified: attr("boolean", { allowNull: true, defaultValue: null }),

  customer: belongsTo("customer"),
  project: belongsTo("project"),
  task: belongsTo("task"),
  user: belongsTo("user"),
});
