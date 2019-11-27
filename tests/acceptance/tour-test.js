import { click, visit } from '@ember/test-helpers'
import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import destroyApp from '../helpers/destroy-app'
import startApp from '../helpers/start-app'
import { module, test } from 'qunit'

module('Acceptance | tour', function(hooks) {
  let application

  hooks.beforeEach(async function() {
    application = startApp()

    let user = server.create('user', { tourDone: false })

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

    localStorage.removeItem('timed-tour')

    setBreakpoint('xl')
  })

  hooks.afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  test('shows a welcome dialog', async function(assert) {
    await visit('/')

    assert.dom('.modal--visible').exists({ count: 1 })
  })

  test('does not show a welcome dialog when tour completed', async function(
    assert
  ) {
    let user = server.create('user', { tourDone: true })

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

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
