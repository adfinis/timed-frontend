import {
  classNames,
  attributeBindings,
  classNameBindings,
  tagName,
} from "@ember-decorators/component";
import Component from "@ember/component";
import { tracked } from "@glimmer/tracking";
import classic from "ember-classic-decorator";

const { round } = Math;

/**
 * Component to display a progress bar
 *
 * @class ProgressBarComponent
 * @extends Ember.Component
 * @public
 */
@classic
@tagName("progress")
@attributeBindings("value", "max")
@classNames("progress-bar")
@classNameBindings("color")
class ProgressBarComponent extends Component {
  /**
   * The current progress as a factor
   *
   * @property {Number} progress
   * @public
   */
  @tracked progress = 0;

  /**
   * Custom color of the progress bar, this is added as a class
   *
   * @property {String} color
   * @public
   */
  color = null;

  /**
   * The current progress value
   *
   * @property {Number} value
   * @public
   */
  get value() {
    return round(this.progress * 100);
  }

  /**
   * The max value
   *
   * @property {Number} max
   * @default 100
   * @public
   */
  max = 100;
}

ProgressBarComponent.reopenClass({
  positionalParams: ["progress"],
});

export default ProgressBarComponent;
