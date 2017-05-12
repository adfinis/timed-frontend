import { expect } from 'chai';
import { describe, it } from 'mocha';
import Ember from 'ember';
import TaskSelectionRouteMixin from 'timed/mixins/task-selection-route';

describe('Unit | Mixin | task selection route', function() {
  // Replace this with your real tests.
  it('works', function() {
    let TaskSelectionRouteObject = Ember.Object.extend(TaskSelectionRouteMixin);
    let subject = TaskSelectionRouteObject.create();
    expect(subject).to.be.ok;
  });
});
