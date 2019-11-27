import { currentURL, visit } from '@ember/test-helpers'
import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import destroyApp from '../helpers/destroy-app'
import startApp from '../helpers/start-app'
import { module, test } from 'qunit'

module('Acceptance | notfound', function(hooks) {
  let application

  hooks.beforeEach(async function() {
    application = startApp()
  })

  hooks.afterEach(async function() {
    destroyApp(application)
  })

  test('redirects to login for undefined routes if not logged in', async function(
    assert
  ) {
    await visit('/thiswillneverbeavalidrouteurl')

    assert.equal(currentURL(), '/login')
  })

  test('displays a 404 page for undefined routes if logged in', async function(
    assert
  ) {
    let user = server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

    await visit('/thiswillneverbeavalidrouteurl')

    assert.dom('[data-test-notfound]').exists({ count: 1 })

    await invalidateSession(application)
  })
})
