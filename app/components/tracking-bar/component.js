/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from "@glimmer/component";
import { inject as service } from "@ember/service";

/**
 * The tracking bar component
 *
 * @class TrackingBarComponent
 * @extends Ember.Component
 * @public
 */
export default class TrackingBar extends Component {
  @service tracking;
}
