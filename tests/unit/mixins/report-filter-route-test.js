import { expect } from 'chai'
import { describe, it } from 'mocha'
import EmberObject from '@ember/object'
import ReportFilterRouteMixin from 'timed/mixins/report-filter-route'

describe('Unit | Mixin | report filter route', function() {
  // Replace this with your real tests.
  it('works', function() {
    let ReportFilterRouteObject = EmberObject.extend(ReportFilterRouteMixin)
    let subject = ReportFilterRouteObject.create()
    expect(subject).to.be.ok
  })
})
