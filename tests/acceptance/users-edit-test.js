import { currentURL, visit } from '@ember/test-helpers'
import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import destroyApp from '../helpers/destroy-app'
import startApp from '../helpers/start-app'
import { module, test } from 'qunit'

module('Acceptance | users edit', function(hooks) {
  let application

  hooks.beforeEach(async function() {
    application = startApp()

    let user = server.create('user')

    this.allowed = server.create('user', { supervisorIds: [user.id] })
    this.notAllowed = server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })
  })

  hooks.afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  test('can visit /users/:id', async function(assert) {
    await visit(`/users/${this.allowed.id}`)

    assert.dom(currentURL()).includesText(this.allowed.id)
  })

  test('shows only supervisees', async function(assert) {
    await visit(`/users/${this.notAllowed.id}`)

    assert.dom('.empty').exists()
    assert.dom('.empty').includesText('Halt')
  })

  test('allows all to superuser', async function(assert) {
    let user = server.create('user', { isSuperuser: true })

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

    await visit(`/users/${this.notAllowed.id}`)

    assert.dom(currentURL()).includesText(this.notAllowed.id)
  })
})
