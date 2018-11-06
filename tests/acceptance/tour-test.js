import { click, visit } from '@ember/test-helpers'
import { authenticateSession } from 'ember-simple-auth/test-support'
import { beforeEach, describe, it } from 'mocha'
import { setupApplicationTest } from 'ember-mocha'
import { expect } from 'chai'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'

describe('Acceptance | tour', function() {
  let application = setupApplicationTest()
  setupMirage(application)

  beforeEach(async function() {
    let user = this.server.create('user', { tourDone: false })

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })

    localStorage.removeItem('timed-tour')

    setBreakpoint('xl')
  })

  it('shows a welcome dialog', async function() {
    await visit('/')

    expect(find('.modal--visible')).to.have.length(1)
  })

  it('does not show a welcome dialog when tour completed', async function() {
    let user = this.server.create('user', { tourDone: true })

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })

    await visit('/')

    expect(find('.modal--visible')).to.have.length(0)
  })

  it('does not show a welcome dialog when later clicked', async function() {
    await visit('/')

    expect(find('.modal--visible')).to.have.length(1)

    await click('button:contains(Later)')

    await visit('/someotherroute')
    await visit('/')

    expect(find('.modal--visible')).to.have.length(0)
  })

  it('can ignore tour permanently', async function() {
    await visit('/')

    await click('button:contains(Never)')

    await visit('/someotherroute')
    await visit('/')

    expect(find('.modal--visible')).to.have.length(0)
  })

  it('can start tour', async function() {
    await visit('/')

    await click('button:contains(Sure)')

    expect(find('.modal--visible')).to.have.length(0)
  })
})
