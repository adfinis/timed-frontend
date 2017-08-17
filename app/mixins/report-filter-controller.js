/**
 * @module timed
 * @submodule timed-mixins
 * @public
 */
import Mixin from 'ember-metal/mixin'
import computed from 'ember-computed-decorators'
import moment from 'moment'
import { underscore } from 'ember-string'

const INITIAL_FILTERS = {
  customer: null,
  project: null,
  task: null,
  user: null,
  from_date: null, // eslint-disable-line camelcase
  to_date: null, // eslint-disable-line camelcase
  page_size: 10, // eslint-disable-line camelcase
  page: 1,
  ordering: 'date'
}

/**
 * A mixin to create a page which filters reports by given values
 *
 * This is used in combination with @see ReportFilterRouteMixin
 *
 * @class ReportFilterControllerMixin
 * @extends Ember.Mixin
 * @public
 */
export default Mixin.create({
  /**
   * The query params for the page
   *
   * @property {String[]} queryParams
   * @public
   */
  queryParams: [
    'customer',
    'project',
    'task',
    'user',
    'from_date',
    'to_date',
    'page_size',
    'page',
    'ordering'
  ],

  /**
   * The customer ID to filter by
   *
   * @property {Number} customer
   * @public
   */
  customer: INITIAL_FILTERS.customer,

  /**
   * The project ID to filter by
   *
   * @property {Number} project
   * @public
   */
  project: INITIAL_FILTERS.project,

  /**
   * The task ID to filter by
   *
   * @property {Number} task
   * @public
   */
  task: INITIAL_FILTERS.task,

  /**
   * The user ID to filter by
   *
   * @property {Number} user
   * @public
   */
  user: INITIAL_FILTERS.user,

  /**
   * The start of the filter interval
   *
   * @property {String} from_date
   * @public
   */
  from_date: INITIAL_FILTERS.from_date, // eslint-disable-line camelcase

  /**
   * The end of the filter interval
   *
   * @property {String} to_date
   * @public
   */
  to_date: INITIAL_FILTERS.to_date, // eslint-disable-line camelcase

  /**
   * The page size
   *
   * @property {Number} page_size
   * @public
   */
  page_size: INITIAL_FILTERS.page_size, // eslint-disable-line camelcase

  /**
   * The current page
   *
   * @property {Number} page
   * @public
   */
  page: INITIAL_FILTERS.page,

  /**
   * The ordering
   *
   * @property {String} ordering
   * @public
   */
  ordering: INITIAL_FILTERS.ordering,

  /**
   * The start of the filter interval as moment object
   *
   * @property {moment} _from
   * @private
   */
  @computed('from_date')
  _from(from) {
    return from ? moment(from) : null
  },

  /**
   * The end of the filter interval as moment object
   *
   * @property {moment} _to
   * @private
   */
  @computed('to_date')
  _to(to) {
    return to ? moment(to) : null
  },

  /**
   * Whether any filters are applied
   *
   * This ignores page_size, page and ordering since those are not relevant and
   * always set.
   *
   * @property {Boolean} hasFilters
   * @public
   */
  @computed('model.[]')
  hasFilters() {
    return this.get('queryParams')
      .filter(k => !['page_size', 'page', 'ordering'].includes(k))
      .map(k => this.get(k))
      .any(arg => !!arg)
  },

  /**
   * Reset the filters
   *
   * @method resetFilters
   * @public
   */
  resetFilters() {
    this.setProperties(INITIAL_FILTERS)
  },

  actions: {
    /**
     * Apply the given filters to the query params
     *
     * This also converts the camelcase filter keys to underscore since the
     * backend requests underscore keys.
     *
     * @method applyFilter
     * @param {Object} filters The filters to apply
     * @public
     */
    applyFilter(filters) {
      let parsed = Object.keys(filters).reduce((obj, key) => {
        obj[underscore(key)] = filters[key]

        return obj
      }, {})

      this.setProperties(parsed)
    }
  }
})
