/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import { action } from "@ember/object";
import Component from "@glimmer/component";

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
export default class SyModal extends Component {
  /**
   * Close the modal
   *
   * @method close
   * @public
   */
  @action
  close() {
    (this.args["on-close"] ?? (() => {}))();
  }
}
