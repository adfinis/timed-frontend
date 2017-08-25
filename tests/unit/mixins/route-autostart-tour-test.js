import { expect } from 'chai';
import { describe, it } from 'mocha';
import Ember from 'ember';
import RouteAutostartTourMixin from 'timed/mixins/route-autostart-tour';

describe('Unit | Mixin | route autostart tour', function() {
  // Replace this with your real tests.
  it('works', function() {
    let RouteAutostartTourObject = Ember.Object.extend(RouteAutostartTourMixin);
    let subject = RouteAutostartTourObject.create();
    expect(subject).to.be.ok;
  });
});
