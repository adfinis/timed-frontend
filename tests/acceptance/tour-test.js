import { visit } from '@ember/test-helpers'
import { authenticateSession } from 'ember-simple-auth/test-support'
import { beforeEach, describe, it } from 'mocha'
import { setupApplicationTest } from 'ember-mocha'
import { expect } from 'chai'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'
import { setBreakpoint } from 'ember-responsive/test-support'
import {
  tourNextStep,
  getTourElement,
  getTourStep
} from 'ember-site-tour/test-support/helpers'

describe('Acceptance | tour', function() {
  let application = setupApplicationTest()

  setupMirage(application)

  beforeEach(async function() {
    let user = this.server.create('user', { tourDone: false })

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })

    localStorage.removeItem('timed-tour')

    await setBreakpoint('xl')
  })

  it('shows a welcome dialog', async function() {
    await visit('/')

    expect(await getTourElement()).to.exist
  })

  it('does not show a welcome dialog when tour completed', async function() {
    let user = this.server.create('user', { tourDone: true })

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })

    await visit('/')

    expect(await getTourElement()).to.not.be.ok
  })

  it('can start tour', async function() {
    await visit('/')

    await tourNextStep()

    expect(await getTourStep()).to.equal(2)
  })
})
