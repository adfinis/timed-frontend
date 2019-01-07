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
  setupTest()

  beforeEach(function() {
    this.owner.register('service:mockStore', storeStub)
    this.owner.inject('service:tracking', 'store', 'service:mockStore')
  })

  it('exists', function() {
    let service = this.owner.lookup('service:tracking')
    expect(service).to.be.ok
  })
})
