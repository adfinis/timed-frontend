import Controller from '@ember/controller'
import computed from 'ember-computed-decorators'

/**
 * Controller for the user list
 *
 * @class UserIndexController
 * @extends Ember.Controller
 * @public
 */
export default Controller.extend({
  /**
   * The query parameters
   *
   * @property {String[]} queryParams
   * @public
   */
  queryParams: [
    'supervisor',
    'active',
    'search',
    'ordering',
    'page',
    'page_size'
  ],

  /**
   * The supervisor id
   *
   * @property {Number} supervisor
   * @public
   */
  supervisor: null,

  /**
   * Whether to filter active users
   *
   * This can have three values:
   *   - '1': only active (default)
   *   - '0': only inactive
   *   - empty string: either
   *
   * @property {String} active
   * @public
   */
  active: '1',

  /**
   * The search term
   *
   * @property {String} search
   * @public
   */
  search: '',

  /**
   * The default ordering
   *
   * @property {String} ordering
   * @public
   */
  ordering: 'username',

  /**
   * The current page
   *
   * @property {Number} page
   * @public
   */
  page: 1,

  /**
   * The page size
   *
   * @property {Number} page_size
   * @public
   */
  page_size: 20, // eslint-disable-line camelcase

  /**
   * The filters which can be applied
   *
   * This is an temporary store for selected filter values which are not
   * applied yet
   *
   * @property {Object} filters
   * @public
   */
  filters: {},

  /**
   * The used search
   *
   * @property {String} _search
   * @private
   */
  @computed('search')
  _search: {
    get: search => search,
    set(value) {
      this.set('filters.search', value)

      return value
    }
  },

  /**
   * The selected supervisor object
   *
   * @property {User} _supervisor
   * @private
   */
  @computed('supervisor')
  _supervisor: {
    get(id) {
      return this.store.peekRecord('user', id)
    },
    set(value) {
      this.set('filters.supervisor', value && value.id)

      return value
    }
  },

  /**
   * Whether to show inactive users
   *
   * @property {Boolean} _inactive
   * @private
   */
  @computed('active')
  _inactive: {
    get: active => !active,
    set(value) {
      this.set('filters.active', value ? '' : '1')

      return value
    }
  },

  actions: {
    /**
     * Apply the temporary filters to the query params
     *
     * @method applyFilters
     * @public
     */
    applyFilters() {
      this.setProperties(this.get('filters'))
    },

    /**
     * Reset all filters
     *
     * @method resetFilters
     * @public
     */
    resetFilters() {
      this.setProperties({
        _supervisor: null,
        _inactive: false,
        _search: ''
      })

      this.send('applyFilters')
    }
  }
})
