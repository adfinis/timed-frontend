import Model, { attr, belongsTo } from "@ember-data/model";

export default class ReportIntersection extends Model {
  @attr("string") comment;
  @attr("boolean", { allowNull: true, defaultValue: null }) notBillable;
  @attr("boolean", { allowNull: true, defaultValue: false }) rejected;
  @attr("boolean", { allowNull: true, defaultValue: null }) review;
  @attr("boolean", { allowNull: true, defaultValue: null }) billed;
  @attr("boolean", { allowNull: true, defaultValue: null }) verified;

  @belongsTo("customer") customer;
  @belongsTo("project") project;
  @belongsTo("task") task;
  @belongsTo("user") user;
}
