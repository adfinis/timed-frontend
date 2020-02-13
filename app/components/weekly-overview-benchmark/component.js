/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from "@ember/component";
import { computed } from "@ember/object";
import { htmlSafe } from "@ember/string";

/**
 * Component to show a benchmark (reached worktime) in the weekly overview
 *
 * @class WeeklyOverviewBenchmarkComponent
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  /**
   * Class name bindings
   *
   * @property {String[]} classNameBindings
   * @public
   */
  classNameBindings: ["expected"],

  /**
   * Maximum worktime
   *
   * This is 'only' 20h since noone works 24h a day..
   *
   * @property {Number} max
   * @public
   */
  max: 20,

  /**
   * Hours of the benchmark
   *
   * @property {Number} hours
   * @public
   */
  hours: 0,

  /**
   * Whether it is the expected worktime
   *
   * @property {Boolean} expected
   * @public
   */
  expected: false,

  /**
   * Whether to show the hour label
   *
   * @property {Boolean} showLabel
   * @public
   */
  showLabel: false,

  /**
   * The offset to the bottom
   *
   * @property {String} style
   * @public
   */
  style: computed("max", "hours", function() {
    return htmlSafe(
      `bottom: calc(100% / ${this.get("max")} * ${this.get("hours")})`
    );
  })
});
