import { expect } from 'chai';
import { describe, it } from 'mocha';
import Ember from 'ember';
import StatisticsControllerMixin from 'timed/mixins/statistics-controller';

describe('Unit | Mixin | statistics controller', function() {
  // Replace this with your real tests.
  it('works', function() {
    let StatisticsControllerObject = Ember.Object.extend(StatisticsControllerMixin);
    let subject = StatisticsControllerObject.create();
    expect(subject).to.be.ok;
  });
});
