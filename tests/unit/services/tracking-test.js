import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'
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

module('Unit | Service | tracking', function(hooks) {
  setupTest(hooks)

  hooks.beforeEach(function() {
    this.register('service:store', storeStub)
    this.inject.service('store', { as: 'store' })
  })

  // Replace this with your real tests.
  test('exists', function(assert) {
    let service = this.owner.lookup('service:tracking')
    assert.ok(service)
  })
})
