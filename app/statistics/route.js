import Route from '@ember/routing/route'
import ReportFilterRouteMixin from 'timed/mixins/report-filter-route'
import DesktopOnlyRouteMixin from 'timed/mixins/desktop-only-route'

export default Route.extend(ReportFilterRouteMixin, DesktopOnlyRouteMixin, {
  model(params) {
    console.log(params)
    return params
  }
})
