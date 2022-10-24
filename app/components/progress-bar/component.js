import Component from "@ember/component";
import { computed } from "@ember/object";

const { round } = Math;

/**
 * Component to display a progress bar
 *
 * @class ProgressBarComponent
 * @extends Ember.Component
 * @public
 */
const ProgressBarComponent = Component.extend({
  /**
   * Element tag name, use html5 progress tag since we don't need to support
   * older browsers
   *
   * @property {String} tagName
   * @public
   */
  tagName: "progress",

  /**
   * Attribute bindings, Bind value and max to the element
   *
   * @property {String[]} attributeBindings
   * @public
   */
  attributeBindings: ["value", "max"],

  /**
   * CSS class names
   *
   * @property {String[]} classNames
   * @public
   */
  classNames: ["progress-bar"],

  /**
   * CSS class name bindings, bind a certain color if given
   *
   * @property {String[]} classNameBindings
   * @public
   */
  classNameBindings: ["color"],

  /**
   * The current progress as a factor
   *
   * @property {Number} progress
   * @public
   */
  progress: 0,

  /**
   * Custom color of the progress bar, this is added as a class
   *
   * @property {String} color
   * @public
   */
  color: null,

  /**
   * The current progress value
   *
   * @property {Number} value
   * @public
   */
  value: computed("progress", function() {
    return round(this.progress * 100);
  }),

  /**
   * The max value
   *
   * @property {Number} max
   * @default 100
   * @public
   */
  max: 100
});

ProgressBarComponent.reopenClass({
  positionalParams: ["progress"]
});

export default ProgressBarComponent;
