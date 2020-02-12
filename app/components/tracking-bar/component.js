/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from "@ember/component";
import { inject as service } from "@ember/service";

/**
 * The tracking bar component
 *
 * @class TrackingBarComponent
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  tracking: service("tracking"),

  classNames: ["tracking-bar"]
});
