import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Controller | reschedule', function() {
  setupTest('controller:reschedule', {
    needs: ['service:notify']
  })

  it('exists', function() {
    let controller = this.subject()
    expect(controller).to.be.ok
  })
})
