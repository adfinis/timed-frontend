import classic from "ember-classic-decorator";
/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from "@ember/component";

/**
 * Target component for the sy modal
 *
 * @class SyModalTargetComponent
 * @extends Ember.Component
 * @public
 */
@classic
export default class SyModalTarget extends Component {
 /**
  * The id of the container. This is the wormhole target.
  *
  * @property {String} elementId
  * @public
  */
 elementId = "sy-modals";
}
