/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from '@ember/controller'
import ReportFilterControllerMixin from 'timed/mixins/report-filter-controller'

/**
 * Controller for filtering and rescheduling reports
 *
 * @class RescheduleController
 * @extends Ember.Controller
 * @using ReportFilterControllerMixin
 * @public
 */
export default Controller.extend(ReportFilterControllerMixin, {})
