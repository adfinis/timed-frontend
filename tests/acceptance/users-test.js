import { click, fillIn, currentURL, visit } from '@ember/test-helpers'
import {
  authenticateSession,
  invalidateSession
} from 'ember-simple-auth/test-support'
import { module, test } from 'qunit'
import { setupApplicationTest } from 'ember-qunit'
import { setupMirage } from 'ember-cli-mirage/test-support'

module('Acceptance | users', function(hooks) {
  setupApplicationTest(hooks)
  setupMirage(hooks)

  hooks.beforeEach(async function() {
    let user = this.server.create('user')

    this.server.createList('user', 5, { supervisorIds: [user.id] })
    this.server.createList('user', 5)

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })
  })

  hooks.afterEach(async function() {
    await invalidateSession()
  })

  test('shows only supervisees', async function(assert) {
    await visit('/users')

    // 5 supervisees and the user himself
    assert.dom('table tr').exists({ count: 6 })
  })

  test('shows all to superuser', async function(assert) {
    let user = this.server.create('user', { isSuperuser: true })

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })

    await visit('/users')

    // 12 users and the user himself
    assert.dom('table tr').exists({ count: 13 })
  })

  test('can filter and reset', async function(assert) {
    let user = this.server.create('user', { isSuperuser: true })

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })

    await visit('/users')

    await click('[data-test-filter-active] button:nth-child(1)')
    await fillIn('[data-test-filter-search] input', 'foobar')
    await selectSearch('[data-test-filter-user] .user-select', user.username)
    await userSelect()

    assert.dom(currentURL()).includesText('search=foobar')
    assert.dom(currentURL()).includesText('active=')
    assert.dom(currentURL()).includesText('supervisor=12')

    await click('.filter-sidebar-reset')

    assert.equal(currentURL(), '/users')
  })
})
