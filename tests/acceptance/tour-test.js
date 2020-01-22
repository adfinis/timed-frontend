import { click, visit } from '@ember/test-helpers'
import {
  authenticateSession,
  invalidateSession
} from 'ember-simple-auth/test-support'
import { module, test } from 'qunit'
import { setupApplicationTest } from 'ember-qunit'
import { setupMirage } from 'ember-cli-mirage/test-support'

module('Acceptance | tour', function(hooks) {
  setupApplicationTest(hooks)
  setupMirage(hooks)

  hooks.beforeEach(async function() {
    let user = this.server.create('user', { tourDone: false })

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })

    localStorage.removeItem('timed-tour')

    setBreakpoint('xl')
  })

  hooks.afterEach(async function() {
    await invalidateSession()
  })

  test('shows a welcome dialog', async function(assert) {
    await visit('/')

    assert.dom('.modal--visible').exists({ count: 1 })
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

    await click('button:contains(Later)')

    await visit('/someotherroute')
    await visit('/')

    assert.dom('.modal--visible').doesNotExist()
  })

  test('can ignore tour permanently', async function(assert) {
    await visit('/')

    await click('button:contains(Never)')

    await visit('/someotherroute')
    await visit('/')

    assert.dom('.modal--visible').doesNotExist()
  })

  test('can start tour', async function(assert) {
    await visit('/')

    await click('button:contains(Sure)')

    assert.dom('.modal--visible').doesNotExist()
  })
})
