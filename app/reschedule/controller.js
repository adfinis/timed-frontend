/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from 'ember-controller'
import ReportFilterControllerMixin from 'timed/mixins/report-filter-controller'

/**
 * Controller for filtering and rescheduling reports
 *
 * @class RescheduleController
 * @extends Ember.Controller
 * @using ReportFilterControllerMixin
 * @public
 */
export default Controller.extend(ReportFilterControllerMixin, {
  /**
   * Some more query params to filter by
   *
   * @property {String[]} queryParams
   * @public
   */
  queryParams: [
    'reviewer',
    'billing_type',
    'review',
    'not_billable',
    'not_verified'
  ],

  /**
   * The person which is assigned to review the project
   *
   * @property {Number} reviewer
   * @public
   */
  reviewer: null,

  /**
   * The billing type to filter by
   *
   * @property {Number} billingType
   * @public
   */
  billing_type: null, // eslint-disable-line camelcase

  /**
   * Whether the reports need a review
   *
   * @property {Number} review
   * @public
   */
  review: null,

  /**
   * Whether the reports are not billable
   *
   * @property {Number} not_billable
   * @public
   */
  not_billable: null, // eslint-disable-line camelcase

  /**
   * Whether the reports are not verified yet
   *
   * @property {Number} not_verified
   * @public
   */
  not_verified: null // eslint-disable-line camelcase
})
