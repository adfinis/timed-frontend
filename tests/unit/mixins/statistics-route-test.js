import { expect } from 'chai';
import { describe, it } from 'mocha';
import Ember from 'ember';
import StatisticsRouteMixin from 'timed/mixins/statistics-route';

describe('Unit | Mixin | statistics route', function() {
  // Replace this with your real tests.
  it('works', function() {
    let StatisticsRouteObject = Ember.Object.extend(StatisticsRouteMixin);
    let subject = StatisticsRouteObject.create();
    expect(subject).to.be.ok;
  });
});
