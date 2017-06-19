import { expect }                   from 'chai'
import { it, describe, beforeEach } from 'mocha'
import { setupTest }                from 'ember-mocha'
import { trackingStub }             from 'timed/tests/integration/components/tracking-bar/component-test'

describe('Unit | Controller | index', function() {
  setupTest('controller:index', {
    // Specify the other units that are required for this test.
    needs: [ 'model:activity', 'service:session' ]
  })

  beforeEach(function() {
    this.register('service:tracking', trackingStub)
    this.inject.service('tracking', { as: 'tracking' })
  })

  it('exists', function() {
    let controller = this.subject()
    expect(controller).to.be.ok
  })
})
