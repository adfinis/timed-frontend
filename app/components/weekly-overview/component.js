/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from "@ember/component";
import { computed } from "@ember/object";
import { htmlSafe } from "@ember/string";

/**
 * The weekly overview
 *
 * @class WeeklyOverviewComponent
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  /**
   * Attribute bindings
   *
   * @property {String[]} attributeBindings
   * @public
   */
  attributeBindings: ["style"],

  /**
   * The height of the overview in pixels
   *
   * @property {Number} height
   * @public
   */
  height: 150,

  /**
   * The expected worktime in hours
   *
   * @property {Number} hours
   * @public
   */
  hours: computed("expected", function() {
    return this.get("expected").asHours();
  }),

  /**
   * The style of the element
   *
   * This computes the height of the element
   *
   * @property {String} style
   * @public
   */
  style: computed("height", function() {
    return htmlSafe(`height: ${this.get("height")}px;`);
  })
});
