import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Controller | analysis', function() {
  setupTest('controller:analysis', {
    needs: ['service:session']
  })

  it('computes download URLs correctly', function() {
    let controller = this.subject()
    controller.set('token', 'foobar')
    expect(controller.getTarget('test', { foo: 'bar' })).to.equal(
      'test?foo=bar&jwt=foobar'
    )
  })
})
