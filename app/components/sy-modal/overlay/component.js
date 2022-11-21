import classic from "ember-classic-decorator";
import { classNames, classNameBindings } from "@ember-decorators/component";
/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from "@ember/component";

/**
 * Overlay component for sy modal
 *
 * @class SyModalOverlayComponent
 * @extends Ember.Component
 * @public
 */
@classic
@classNames("modal")
@classNameBindings("visible:modal--visible")
export default class Overlay extends Component {
 /**
  * Close the modal if the user clicks on the overlay, not a child of it
  *
  * @event click
  * @param {jQuery.Event} e The jquery click event
  * @public
  */
 click(e) {
   if (e.target === this.element) {
     this["on-close"]();
   }
 }
}
