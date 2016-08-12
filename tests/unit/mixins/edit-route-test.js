import Ember from 'ember';
import EditRouteMixin from 'timed/mixins/edit-route';
import { module, test } from 'qunit';

module('Unit | Mixin | edit route');

// Replace this with your real tests.
test('it works', function(assert) {
  let EditRouteObject = Ember.Object.extend(EditRouteMixin);
  let subject = EditRouteObject.create();
  assert.ok(subject);
});
