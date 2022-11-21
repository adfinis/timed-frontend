import classic from "ember-classic-decorator";
import { classNames } from "@ember-decorators/component";
/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from "@ember/component";

/**
 * Body component for sy modal
 *
 * @class SyModalBodyComponent
 * @extends Ember.Component
 * @public
 */
@classic
@classNames("modal-body")
export default class Body extends Component {}
