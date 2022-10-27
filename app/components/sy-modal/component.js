import classic from "ember-classic-decorator";
import { get, action } from "@ember/object";
/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from "@ember/component";

/**
 * Main component for sy modal
 *
 * Usage:
 * ```handlebars
 * {{#sy-modal visible=true as |modal|}}
 *   {{#modal.header}}
 *     Title for this modal!
 *   {{/modal.header}}
 *   {{#modal.body}}
 *     Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
 *    eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
 *    diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
 *    Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
 *    dolor sit amet.
 *   {{/modal.body}}
 *   {{#modal.footer}}
 *    <button class="btn btn-default" {{action 'close'}}>Close</button>
 *   {{/modal.footer}}
 * {{/sy-modal}}
 * ```
 *
 * @class SyModalComponent
 * @public
 */
@classic
export default class SyModal extends Component {
 /**
  * Whether the modal is visible
  *
  * @property {Boolean} visible
  * @public
  */
 visible = false;

 /**
  * Close the modal
  *
  * @method close
  * @public
  */
 @action
 close() {
   this.set("visible", false);

   (get(this, "on-close") ?? (() => {}))();
 }
}
