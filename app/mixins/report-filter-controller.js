/**
 * @module timed
 * @submodule timed-mixins
 * @public
 */
import Mixin from 'ember-metal/mixin'
import computed from 'ember-computed-decorators'
import moment from 'moment'
import { underscore } from 'ember-string'

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
  customer: null,

  /**
   * The project ID to filter by
   *
   * @property {Number} project
   * @public
   */
  project: null,

  /**
   * The task ID to filter by
   *
   * @property {Number} task
   * @public
   */
  task: null,

  /**
   * The user ID to filter by
   *
   * @property {Number} user
   * @public
   */
  user: null,

  /**
   * The start of the filter interval
   *
   * @property {String} from_date
   * @public
   */
  from_date: null, // eslint-disable-line camelcase

  /**
   * The end of the filter interval
   *
   * @property {String} to_date
   * @public
   */
  to_date: null, // eslint-disable-line camelcase

  /**
   * The page size
   *
   * @property {Number} page_size
   * @public
   */
  page_size: 10, // eslint-disable-line camelcase

  /**
   * The current page
   *
   * @property {Number} page
   * @public
   */
  page: 1,

  /**
   * The ordering
   *
   * @property {String} ordering
   * @public
   */
  ordering: 'date',

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
