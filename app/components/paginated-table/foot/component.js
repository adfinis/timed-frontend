import Component from '@ember/component'

/**
 * Paginated table foot component
 *
 * @class PaginatedTableFootComponent
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
  tagName: 'tfoot',

  /**
   * The selectable page limits
   *
   * @property {Number[]} limits
   * @public
   */
  limits: [10, 20, 50, 100],

  actions: {
    /**
     * Set a page limit
     *
     * This needs to reset the page, since it could be that the current page
     * does not exist anymore
     *
     * @method setLimit
     * @param {Number} limit The new page limit
     * @public
     */
    setLimit(limit) {
      this.setProperties({
        page: 1,
        page_size: limit // eslint-disable-line camelcase
      })
    }
  }
})
