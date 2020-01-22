import { currentURL, visit } from '@ember/test-helpers'
import {
  authenticateSession,
  invalidateSession
} from 'ember-simple-auth/test-support'
import { module, test } from 'qunit'
import { setupApplicationTest } from 'ember-qunit'
import { setupMirage } from 'ember-cli-mirage/test-support'

module('Acceptance | users edit', function(hooks) {
  setupApplicationTest(hooks)
  setupMirage(hooks)

  hooks.beforeEach(async function() {
    let user = this.server.create('user')

    this.allowed = this.server.create('user', { supervisorIds: [user.id] })
    this.notAllowed = this.server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })
  })

  hooks.afterEach(async function() {
    await invalidateSession()
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
    let user = this.server.create('user', { isSuperuser: true })

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })

    await visit(`/users/${this.notAllowed.id}`)

    assert.dom(currentURL()).includesText(this.notAllowed.id)
  })
})
