import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Controller | analysis', function() {
  setupTest('controller:analysis', {
    needs: ['service:session']
  })

  it('computes download URLs correctly', function() {
    let controller = this.subject()

    controller.set('jwt', 'foobar')
    controller.set('user', 1)
    controller.set('page', 2)
    controller.set('page_size', 100)
    controller.set('customer', 1)

    let target = controller.getTarget('test')

    expect(target).to.contain('jwt=foobar')
    expect(target).to.contain('user=1')
    expect(target).to.contain('customer=1')
    expect(target).to.not.contain('page')
    expect(target).to.not.contain('page_size')
  })
})
