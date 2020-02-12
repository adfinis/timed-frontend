/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import { reads } from "@ember/object/computed";
import attr from "ember-data/attr";
import Model from "ember-data/model";
import { hasMany } from "ember-data/relationships";

/**
 * The customer model
 *
 * @class Customer
 * @extends DS.Model
 * @public
 */
const Customer = Model.extend({
  /**
   * The name
   *
   * @property name
   * @type {String}
   * @public
   */
  name: attr("string", { defaultValue: "" }),

  /**
   * Whether the project is archived
   *
   * @property archived
   * @type {Boolean}
   * @public
   */
  archived: attr("boolean", { defaultValue: false }),

  /**
   * The projects
   *
   * @property projects
   * @type {Project[]}
   * @public
   */
  projects: hasMany("project"),

  /**
   * Long name - alias for name, used for filtering in the customer box
   *
   * @property {String} longName
   * @public
   */
  longName: reads("name")
});

export default Customer;
