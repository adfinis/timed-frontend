import { expect } from 'chai'
import { describe, it } from 'mocha'
import EmberObject from 'ember-object'
import ReportFilterControllerMixin from 'timed/mixins/report-filter-controller'

describe('Unit | Mixin | report filter controller', function() {
  // Replace this with your real tests.
  it('works', function() {
    let ReportFilterControllerObject = EmberObject.extend(
      ReportFilterControllerMixin
    )
    let subject = ReportFilterControllerObject.create()
    expect(subject).to.be.ok
  })
})
