import Component from 'ember-component'

/**
 * Paginated table component
 *
 * @class PaginatedComponent
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  /**
   * The tagName of the component
   *
   * @property {string} tagName
   * @public
   */
  tagName: 'table',

  /**
   * Classes of the component
   *
   * @property {string[]} classNames
   * @public
   */
  classNames: ['table', 'table--striped', 'table--hover']
})
