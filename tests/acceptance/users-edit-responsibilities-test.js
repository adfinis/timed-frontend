import { visit } from '@ember/test-helpers'
import { authenticateSession } from 'ember-simple-auth/test-support'
import { module, test } from 'qunit'
import { setupApplicationTest } from 'ember-qunit'
import { setupMirage } from 'ember-cli-mirage/test-support'

module('Acceptance | users edit responsibilities', function(hooks) {
  setupApplicationTest(hooks)
  setupMirage(hooks)

  hooks.beforeEach(async function() {
    this.user = this.server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: this.user.id })
  })

  test('can visit /users/:id/responsibilities', async function(assert) {
    await visit(`/users/1/responsibilities`)

    assert.dom('.card').exists({ count: 2 })
  })
})
