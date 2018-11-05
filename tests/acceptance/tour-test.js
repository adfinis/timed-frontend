import { click, visit } from '@ember/test-helpers'
import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import { describe, it, beforeEach, afterEach } from 'mocha'
import destroyApp from '../helpers/destroy-app'
import { expect } from 'chai'
import startApp from '../helpers/start-app'

describe('Acceptance | tour', function() {
  let application

  beforeEach(async function() {
    application = startApp()

    let user = server.create('user', { tourDone: false })

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

    localStorage.removeItem('timed-tour')

    setBreakpoint('xl')
  })

  afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  it('shows a welcome dialog', async function() {
    await visit('/')

    expect(find('.modal--visible')).to.have.length(1)
  })

  it('does not show a welcome dialog when tour completed', async function() {
    let user = server.create('user', { tourDone: true })

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

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
