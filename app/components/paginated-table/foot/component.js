import { tagName } from "@ember-decorators/component";
import Component from "@ember/component";
import classic from "ember-classic-decorator";

/**
 * Paginated table foot component
 *
 * @class PaginatedTableFootComponent
 * @extends Ember.Component
 * @public
 */
@classic
@tagName("tfoot")
export default class Foot extends Component {}
