/**
 * @module timed
 * @submodule timed-mixins
 * @public
 */
import Mixin from '@ember/object/mixin'
import computed, { observes } from 'ember-computed-decorators'
import moment from 'moment'
import { underscore } from '@ember/string'
import $ from 'jquery'

const INITIAL_FILTERS = {
  customer: null,
  project: null,
  task: null,
  user: null,
  from_date: null, // eslint-disable-line camelcase
  to_date: null, // eslint-disable-line camelcase
  reviewer: null,
  billing_type: null, // eslint-disable-line camelcase
  cost_center: null, // eslint-disable-line camelcase
  review: null,
  not_billable: null, // eslint-disable-line camelcase
  not_verified: null, // eslint-disable-line camelcase
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
    'reviewer',
    'billing_type',
    'cost_center',
    'review',
    'not_billable',
    'not_verified',
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
   * The person which is assigned to review the project
   *
   * @property {Number} reviewer
   * @public
   */
  reviewer: INITIAL_FILTERS.reviewer,

  /**
   * The billing type to filter by
   *
   * @property {Number} billingType
   * @public
   */
  billing_type: INITIAL_FILTERS.billing_type, // eslint-disable-line camelcase

  /**
   * The cost center to filter by
   *
   * @property {Number} costCenter
   * @public
   */
  cost_center: INITIAL_FILTERS.cost_center, // eslint-disable-line camelcase

  /**
   * Whether the reports need a review
   *
   * @property {Number} review
   * @public
   */
  review: INITIAL_FILTERS.review,

  /**
   * Whether the reports are not billable
   *
   * @property {Number} not_billable
   * @public
   */
  not_billable: INITIAL_FILTERS.not_billable, // eslint-disable-line camelcase

  /**
   * Whether the reports are not verified yet
   *
   * @property {Number} not_verified
   * @public
   */
  not_verified: INITIAL_FILTERS.not_verified, // eslint-disable-line camelcase

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
   * Reset the filters except page_size which we want to preserve
   *
   * @method resetFilters
   * @public
   */
  resetFilters() {
    let filtersToReset = Object.keys(INITIAL_FILTERS)
      .filter(k => k !== 'page_size')
      .reduce((obj, k) => ({ ...obj, [k]: INITIAL_FILTERS[k] }), {})

    this.setProperties(filtersToReset)
  },

  /**
   * Scroll to the top of the page when the displayed data changes
   *
   * @method _scrollTop
   * @private
   */
  @observes('model.[]')
  _scrollTop() {
    $('.page-content').animate({ scrollTop: 0 })
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
        return { ...obj, [underscore(key)]: filters[key] }
      }, {})

      this.setProperties(parsed)
    }
  }
})
