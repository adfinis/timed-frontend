/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from 'ember-component'
import EmberObject from 'ember-object'
import computed from 'ember-computed-decorators'

const DATE_FORMAT = 'YYYY-MM-DD'

// Options can be '', '0' or '1' from a select box
const option = val => (['0', '1'].includes(val) ? val : null)
const id = obj => (obj ? obj.get('id') : null)
const date = date => (date ? date.format(DATE_FORMAT) : null)
const intOrNull = val => parseInt(val) || null

const FILTERS = {
  customer: { default: null, cast: id },
  project: { default: null, cast: id },
  task: { default: null, cast: id },
  user: { default: null, cast: id },
  reviewer: { default: null, cast: id },
  billingType: { default: null, cast: intOrNull },
  fromDate: { default: null, cast: date },
  toDate: { default: null, cast: date },
  review: { default: null, cast: option },
  notBillable: { default: null, cast: option },
  notVerified: { default: null, cast: option }
}

/**
 * Component to filter reports
 *
 * @class ReportFilterComponent
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  /**
   * The date format to use
   *
   * @property {String} DATE_FORMAT
   * @public
   */
  DATE_FORMAT,

  /**
   * Element tag name
   *
   * @property {String} tagName
   * @public
   */
  tagName: 'form',

  /**
   * Submit event, apply the filters
   *
   * @event submit
   * @param {jQuery.Event} e The jquery event
   * @public
   */
  submit(e) {
    e.preventDefault()

    this.send('apply')
  },

  /**
   * Did receive attrs hook, set the default filters or initial values
   *
   * @method didReceiveAttrs
   * @public
   */
  didReceiveAttrs() {
    this._super(...arguments)

    this._setDefaultFilters(this.get('initial'))
  },

  /**
   * Set the default filters or initial values if given
   *
   * @method _setDefaultFilters
   * @param {Object} initial Initial values
   * @private
   */
  _setDefaultFilters(initial = {}) {
    let filters = EmberObject.create(
      this.get('_enabledFilters').reduce((obj, key) => {
        return {
          ...obj,
          [key]:
            initial[key] === undefined ? FILTERS[key].default : initial[key]
        }
      }, {})
    )

    this.set('filters', filters)
  },

  /**
   * All avilable filters
   *
   * @property {String[]} availableFilters
   * @public
   */
  availableFilters: Object.keys(FILTERS),

  /**
   * All enabled filters
   *
   * @property {String[]} enabledFilters
   * @public
   */
  enabledFilters: Object.keys(FILTERS),

  /**
   * All enabled filters which are also available
   *
   * @property {String[]} _enabledFilters
   * @private
   */
  @computed('enabledFilters.[]', 'availableFilters.[]')
  _enabledFilters(enabledFilters, availableFilters) {
    return enabledFilters.filter(f => availableFilters.includes(f))
  },

  actions: {
    /**
     * Cast and apply the current filters
     *
     * @method apply
     * @public
     */
    apply() {
      let rawFilters = this.get('filters')

      let castedFilters = this.get('_enabledFilters').reduce((obj, key) => {
        obj[key] = FILTERS[key].cast(rawFilters[key])

        return obj
      }, {})

      this.getWithDefault('attrs.on-apply', () => {})(castedFilters)
    },

    /**
     * Reset the filters
     *
     * @method reset
     * @public
     */
    reset() {
      this._setDefaultFilters()

      this.send('apply')
    }
  }
})
