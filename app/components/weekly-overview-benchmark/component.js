/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from "@ember/component";
import { htmlSafe } from "@ember/string";
import { classNameBindings } from "@ember-decorators/component";
import { tracked } from "@glimmer/tracking";
import classic from "ember-classic-decorator";

/**
 * Component to show a benchmark (reached worktime) in the weekly overview
 *
 * @class WeeklyOverviewBenchmarkComponent
 * @extends Ember.Component
 * @public
 */
@classic
@classNameBindings("expected")
export default class WeeklyOverviewBenchmark extends Component {
  /**
   * Maximum worktime
   *
   * This is 'only' 20h since noone works 24h a day..
   *
   * @property {Number} max
   * @public
   */
  @tracked max = 20;

  /**
   * Hours of the benchmark
   *
   * @property {Number} hours
   * @public
   */
  @tracked hours = 0;

  /**
   * Whether it is the expected worktime
   *
   * @property {Boolean} expected
   * @public
   */
  expected = false;

  /**
   * Whether to show the hour label
   *
   * @property {Boolean} showLabel
   * @public
   */
  showLabel = false;

  /**
   * The offset to the bottom
   *
   * @property {String} style
   * @public
   */
  get style() {
    return htmlSafe(`bottom: calc(100% / ${this.max} * ${this.hours})`);
  }
}
