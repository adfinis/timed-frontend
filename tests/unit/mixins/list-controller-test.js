import EmberObject         from 'ember-object'
import ListControllerMixin from 'timed/mixins/list-controller'
import { module, test }    from 'qunit'

module('Unit | Mixin | list controller')

// Replace this with your real tests.
test('it works', function(assert) {
  let ListControllerObject = EmberObject.extend(ListControllerMixin)
  let subject = ListControllerObject.create()
  assert.ok(subject)
})
