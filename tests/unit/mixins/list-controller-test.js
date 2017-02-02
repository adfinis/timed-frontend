import { expect }          from 'chai'
import { describe, it }    from 'mocha'
import EmberObject         from 'ember-object'
import ListControllerMixin from 'timed/mixins/list-controller'

describe('Unit | Mixin | list controller', function() {
  // Replace this with your real tests.
  it('works', function() {
    let ListControllerObject = EmberObject.extend(ListControllerMixin)
    let subject = ListControllerObject.create()
    expect(subject).to.be.ok
  })
})
