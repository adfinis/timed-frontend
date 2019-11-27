import { click, fillIn, currentURL, visit } from '@ember/test-helpers'
import { authenticateSession } from 'timed/tests/helpers/ember-simple-auth'
import destroyApp from '../helpers/destroy-app'
import startApp from '../helpers/start-app'
import { module, test } from 'qunit'

module('Acceptance | auth', function(hooks) {
  let application

  hooks.beforeEach(function() {
    application = startApp()

    this.user = server.create('user', {
      firstName: 'John',
      lastName: 'Doe',
      password: '123qwe'
    })
  })

  hooks.afterEach(function() {
    destroyApp(application)
  })

  test('prevents unauthenticated access', async function(assert) {
    await visit('/')
    assert.equal(currentURL(), '/login')
  })

  test('can login', async function(assert) {
    await visit('/login')

    await fillIn('input[type=text]', 'johnd')
    await fillIn('input[type=password]', '123qwe')

    await click('button[type=submit]')

    assert.equal(currentURL(), '/')
  })

  test('validates login', async function(assert) {
    await visit('/login')

    await fillIn('input[type=text]', 'johnd')
    await fillIn('input[type=password]', '123123')

    await click('button[type=submit]')

    assert.equal(currentURL(), '/login')

    await fillIn('input[type=text]', '')
    await fillIn('input[type=password]', '')

    await click('button[type=submit]')

    assert.equal(currentURL(), '/login')
  })

  test('can logout', async function(assert) {
    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: this.user.id })

    await visit('/')

    assert.equal(currentURL(), '/')

    await click('[data-test-logout]')

    assert.equal(currentURL(), '/login')
  })
})
