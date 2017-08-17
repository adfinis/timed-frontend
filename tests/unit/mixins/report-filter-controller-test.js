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

  it('checks if filters are set', function() {
    let ReportFilterControllerObject = EmberObject.extend(
      ReportFilterControllerMixin
    )
    let subject = ReportFilterControllerObject.create()

    expect(subject.get('hasFilters')).to.not.be.ok

    // trigger model change since hasFilter computes on this
    subject.set('model', [])
    subject.set('user', 1)

    expect(subject.get('hasFilters')).to.be.ok
  })
})
