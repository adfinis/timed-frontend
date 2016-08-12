import Ember from 'ember';
import NewRouteMixin from 'timed/mixins/new-route';
import { module, test } from 'qunit';

module('Unit | Mixin | new route');

// Replace this with your real tests.
test('it works', function(assert) {
  let NewRouteObject = Ember.Object.extend(NewRouteMixin);
  let subject = NewRouteObject.create();
  assert.ok(subject);
});
