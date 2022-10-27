import classic from "ember-classic-decorator";
import { classNames, tagName } from "@ember-decorators/component";
import Component from "@ember/component";

/**
 * Paginated table component
 *
 * @class PaginatedTableComponent
 * @extends Ember.Component
 * @public
 */
@classic
@tagName("table")
@classNames("table", "table--striped", "table--hover")
export default class PaginatedTable extends Component {}
