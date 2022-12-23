/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";

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
