import { expect }       from 'chai'
import { describe, it } from 'mocha'
import EmberObject      from 'ember-object'
import ListRouteMixin   from 'timed/mixins/list-route'

describe('Unit | Mixin | list route', function() {
  // Replace this with your real tests.
  it('works', function() {
    let ListRouteObject = EmberObject.extend(ListRouteMixin)
    let subject = ListRouteObject.create()
    expect(subject).to.be.ok
  })
})
