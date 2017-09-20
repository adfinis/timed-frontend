import { expect } from 'chai'
import { describe, it, afterEach } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Service | autostart tour', function() {
  setupTest('service:autostart-tour', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  })

  afterEach(function() {
    localStorage.removeItem('timed-tour-test')
  })

  // Replace this with your real tests.
  it('exists', function() {
    let service = this.subject()
    expect(service).to.be.ok
  })

  it('can set and get the done tours', function() {
    let service = this.subject({ doneKey: 'timed-tour-test' })

    expect(service.get('done')).to.deep.equal([])

    service.set('done', ['test'])

    expect(service.get('done')).to.deep.equal(['test'])
  })

  it('can check if all tours are done', function() {
    let service = this.subject({ doneKey: 'timed-tour-test', tours: ['test'] })

    expect(service.allDone()).to.not.be.ok

    service.set('done', ['test'])

    expect(service.allDone()).to.be.ok

    service.set('done', ['test', 'test2'])

    expect(service.allDone()).to.be.ok
  })
})
