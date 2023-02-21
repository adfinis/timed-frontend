/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from "@ember/component";
import { computed } from "@ember/object";
import { htmlSafe } from "@ember/string";
import {
  attributeBindings,
  classNameBindings,
} from "@ember-decorators/component";
import { tracked } from "@glimmer/tracking";
import classic from "ember-classic-decorator";

/**
 * Component to display a single day in the weekly overview
 *
 * This contains a bar which shows the worktime and the day
 *
 * @class WeeklyOverviewDayComponent
 * @extends Ember.Component
 * @public
 */
@classic
@attributeBindings("style", "title")
@classNameBindings("active", "workday::weekend", "absence", "holiday")
export default class WeeklyOverviewDay extends Component {
  /**
   * Whether there is an absence on this day
   *
   * @property {Boolean} absence
   * @public
   */
  absence = false;

  /**
   * Whether there is an holiday on this day
   *
   * @property {Boolean} holiday
   * @public
   */
  holiday = false;

  /**
   * Whether it is the currently selected day
   *
   * @property {Boolean} active
   * @public
   */
  active = false;

  /**
   * Maximum worktime in hours
   *
   * @property {Number} max
   * @public
   */
  @tracked max = 20;

  /**
   * A prefix to the title
   *
   * @property {String} prefix
   * @public
   */
  @tracked prefix = "";

  /**
   * The element title
   *
   * This is shown on hover. It contains the worktime.
   *
   * @property {String} title
   * @public
   */
  @computed("prefix.length", "worktime")
  get title() {
    const pre = this.prefix?.length ? `${this.prefix}, ` : "";

    let title = `${this.worktime.hours()}h`;

    if (this.worktime.minutes()) {
      title += ` ${this.worktime.minutes()}m`;
    }

    return `${pre}${title}`;
  }

  /**
   * Whether the day is a workday
   *
   * @property {Boolean} workday
   * @public
   */
  workday = true;

  /**
   * The style of the element
   *
   * This computes the height of the bar
   *
   * @property {String} style
   * @public
   */
  @computed("max", "worktime")
  get style() {
    const height = Math.min((this.worktime.asHours() / this.max) * 100, 100);

    return htmlSafe(`height: ${height}%;`);
  }

  /**
   * Click event - fire the on-click action
   */
  click(event) {
    const action = this["on-click"];

    if (action) {
      event.preventDefault();

      this["on-click"](this.day);
    }
  }
}
