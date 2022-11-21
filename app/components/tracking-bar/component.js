import classic from "ember-classic-decorator";
import { classNames } from "@ember-decorators/component";
import { inject as service } from "@ember/service";
/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from "@ember/component";

/**
 * The tracking bar component
 *
 * @class TrackingBarComponent
 * @extends Ember.Component
 * @public
 */
@classic
@classNames("tracking-bar")
export default class TrackingBar extends Component {
 @service("tracking")
 tracking;
}
