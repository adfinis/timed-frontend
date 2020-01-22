import { click, visit } from '@ember/test-helpers'
import {
  authenticateSession,
  invalidateSession
} from 'ember-simple-auth/test-support'
import { waitForStep } from 'ember-site-tour/test-support/helpers'
import { module, test } from 'qunit'
import { setupApplicationTest } from 'ember-qunit'
import { setupMirage } from 'ember-cli-mirage/test-support'
import { setBreakpoint } from 'ember-responsive/test-support'

module('Acceptance | tour', function(hooks) {
  setupApplicationTest(hooks)
  setupMirage(hooks)

  hooks.beforeEach(async function() {
    let user = this.server.create('user', { tourDone: false })

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })

    localStorage.removeItem('timed-tour')

    // This functionality seems to have been removed.
    // I could only find the breakpoint.js file in app/
    //setBreakpoint('xl')
  })

  hooks.afterEach(async function() {
    await invalidateSession()
  })

  test('shows a welcome dialog', async function(assert) {
    await visit('/')

    await waitForStep()
    assert.dom('.tour-index-activities').exists({ count: 1 })
  })

  test('does not show a welcome dialog when tour completed', async function(
    assert
  ) {
    let user = this.server.create('user', { tourDone: true })

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })

    await visit('/')

    assert.dom('.modal--visible').doesNotExist()
  })

  test('does not show a welcome dialog when later clicked', async function(
    assert
  ) {
    await visit('/')

    assert.dom('.modal--visible').exists({ count: 1 })

    await click('button.btn-default')

    await visit('/someotherroute')
    await visit('/')

    assert.dom('.modal--visible').doesNotExist()
  })

  test('can ignore tour permanently', async function(assert) {
    await visit('/')

    await click('button.btn-never')

    await visit('/someotherroute')
    await visit('/')

    assert.dom('.modal--visible').doesNotExist()
  })

  test('can start tour', async function(assert) {
    await visit('/')

    await click('button.btn-primary')

    assert.dom('.modal--visible').doesNotExist()
  })
})
