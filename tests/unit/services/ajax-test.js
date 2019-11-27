import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Service | ajax', function(hooks) {
  setupTest(hooks)

  test('exists', function(assert) {
    let service = this.owner.lookup('service:ajax')
    assert.ok(service)
  })

  test('adds the auth token to the headers', function(assert) {
    let service = this.owner.lookup('service:ajax')

    service.get('session').set('data', { authenticated: { token: 'test' } })

    assert.equal(service.get('headers.Authorization'), 'Bearer test')
  })

  test('does not add the auth token to the headers if no token is given', function(
    assert
  ) {
    let service = this.owner.lookup('service:ajax')

    service.get('session').set('data', { authenticated: { token: null } })

    assert.notOk(service.get('headers.Authorization'))
  })
})
