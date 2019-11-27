import { visit } from '@ember/test-helpers'
import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import destroyApp from '../helpers/destroy-app'
import startApp from '../helpers/start-app'
import { module, test } from 'qunit'

module('Acceptance | users edit responsibilities', function(hooks) {
  let application

  hooks.beforeEach(async function() {
    application = startApp()

    this.user = server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: this.user.id })
  })

  hooks.afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  test('can visit /users/:id/responsibilities', async function(assert) {
    await visit(`/users/1/responsibilities`)

    assert.dom('.card').exists({ count: 2 })
  })
})
