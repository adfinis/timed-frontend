import { expect } from 'chai'
import { describe, it } from 'mocha'
import EmberObject from '@ember/object'
import DesktopOnlyRouteMixin from 'timed/mixins/desktop-only-route'

describe('Unit | Mixin | desktop only route', function() {
  // Replace this with your real tests.
  it('works', function() {
    let DesktopOnlyRouteObject = EmberObject.extend(DesktopOnlyRouteMixin)
    let subject = DesktopOnlyRouteObject.create()
    expect(subject).to.be.ok
  })
})
