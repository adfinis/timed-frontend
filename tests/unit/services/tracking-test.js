import { expect } from 'chai'
import { describe, it, beforeEach } from 'mocha'
import { setupTest } from 'ember-mocha'
import Service from '@ember/service'
import { A as emberA } from '@ember/array'

const storeStub = Service.extend({
  query() {
    return emberA()
  },

  createRecord() {
    return {}
  }
})

describe('Unit | Service | tracking', function() {
  setupTest('service:tracking', {
    // Specify the other units that are required for this test.
    needs: ['model:activity', 'service:notify']
  })

  beforeEach(function() {
    this.register('service:store', storeStub)
    this.inject.service('store', { as: 'store' })
  })

  // Replace this with your real tests.
  it('exists', function() {
    let service = this.subject()
    expect(service).to.be.ok
  })
})
