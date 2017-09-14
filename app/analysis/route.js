import Route from 'ember-route'
import ReportFilterRouteMixin from 'timed/mixins/report-filter-route'
import DesktopOnlyRouteMixin from 'timed/mixins/desktop-only-route'

export default Route.extend(ReportFilterRouteMixin, DesktopOnlyRouteMixin, {})
