import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Controller | users/edit/credits/index', function() {
  setupTest('controller:users/edit/credits/index', {
    // Specify the other units that are required for this test.
    needs: [
      'controller:users.edit',
      'service:notify',
      'service:ajax',
      'service:can',
      'ability:overtime-credit',
      'ability:absence-credit'
    ]
  })

  // Replace this with your real tests.
  it('exists', function() {
    let controller = this.subject()
    expect(controller).to.be.ok
  })
})
