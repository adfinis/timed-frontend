import Ember from 'ember';
import ListRouteMixin from 'timed/mixins/list-route';
import { module, test } from 'qunit';

module('Unit | Mixin | list route');

// Replace this with your real tests.
test('it works', function(assert) {
  let ListRouteObject = Ember.Object.extend(ListRouteMixin);
  let subject = ListRouteObject.create();
  assert.ok(subject);
});
