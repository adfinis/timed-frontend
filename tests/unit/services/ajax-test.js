import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Service | ajax', function() {
  setupTest('service:ajax', {
    // Specify the other units that are required for this test.
    needs: ['service:session']
  })

  it('exists', function() {
    let service = this.subject()
    expect(service).to.be.ok
  })

  it('adds the auth token to the headers', function() {
    let service = this.subject()

    service.get('session').set('data', { authenticated: { token: 'test' } })

    expect(service.get('headers.Authorization')).to.equal('Bearer test')
  })

  it('does not add the auth token to the headers if no token is given', function() {
    let service = this.subject()

    service.get('session').set('data', { authenticated: { token: null } })

    expect(service.get('headers.Authorization')).to.not.be.ok
  })
})
