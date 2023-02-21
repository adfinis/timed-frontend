import Component from "@ember/component";
import { tagName } from "@ember-decorators/component";
import classic from "ember-classic-decorator";

/**
 * Paginated table head component
 *
 * @class PaginatedTableHeadComponent
 * @extends Ember.Component
 * @public
 */
@classic
@tagName("thead")
export default class Head extends Component {}
