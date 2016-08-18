import Ember from 'ember'
import ListControllerMixin from 'timed/mixins/list-controller'
import { module, test } from 'qunit'

module('Unit | Mixin | list controller')

// Replace this with your real tests.
test('it works', function(assert) {
  let ListControllerObject = Ember.Object.extend(ListControllerMixin)
  let subject = ListControllerObject.create()
  assert.ok(subject)
})
