import { expect } from 'chai'
import { describe, it } from 'mocha'
import EmberObject from '@ember/object'
import StaffRouteMixin from 'timed/mixins/staff-route'

describe('Unit | Mixin | staff route', function() {
  // Replace this with your real tests.
  it('works', function() {
    let StaffRouteObject = EmberObject.extend(StaffRouteMixin)
    let subject = StaffRouteObject.create()
    expect(subject).to.be.ok
  })
})
