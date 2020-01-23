import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'
import Service from '@ember/service'
import { A } from '@ember/array'

const storeStub = Service.extend({
  query() {
    return A()
  },

  createRecord() {
    return {}
  }
})

module('Unit | Service | tracking', function(hooks) {
  setupTest(hooks)

  hooks.beforeEach(function() {
    this.owner.register('service:store', storeStub)
  })

  test('exists', function(assert) {
    let service = this.owner.lookup('service:tracking')
    assert.ok(service)
  })
})
