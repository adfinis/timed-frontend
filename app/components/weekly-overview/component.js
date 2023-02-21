import Component from "@ember/component";
import { computed } from "@ember/object";
/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import { htmlSafe } from "@ember/string";
import { attributeBindings } from "@ember-decorators/component";
import { tracked } from "@glimmer/tracking";
import classic from "ember-classic-decorator";

/**
 * The weekly overview
 *
 * @class WeeklyOverviewComponent
 * @extends Ember.Component
 * @public
 */
@classic
@attributeBindings("style")
export default class WeeklyOverview extends Component {
  /**
   * The height of the overview in pixels
   *
   * @property {Number} height
   * @public
   */
  @tracked height = 150;

  /**
   * The expected worktime in hours
   *
   * @property {Number} hours
   * @public
   */
  @computed("expected")
  get hours() {
    return this.expected.asHours();
  }

  /**
   * The style of the element
   *
   * This computes the height of the element
   *
   * @property {String} style
   * @public
   */
  get style() {
    return htmlSafe(`height: ${this.height}px;`);
  }
}
