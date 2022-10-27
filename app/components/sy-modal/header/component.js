import classic from "ember-classic-decorator";
import { classNames } from "@ember-decorators/component";
/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from "@ember/component";

/**
 * Header component for sy modal
 *
 * @class SyModalHeaderComponent
 * @extends Ember.Component
 * @public
 */
@classic
@classNames("modal-header")
export default class Header extends Component {}
