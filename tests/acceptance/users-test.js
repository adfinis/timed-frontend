import { click, fillIn, currentURL, visit } from '@ember/test-helpers'
import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import destroyApp from '../helpers/destroy-app'
import startApp from '../helpers/start-app'
import { module, test } from 'qunit'

module('Acceptance | users', function(hooks) {
  let application

  hooks.beforeEach(async function() {
    application = startApp()

    let user = server.create('user')

    server.createList('user', 5, { supervisorIds: [user.id] })
    server.createList('user', 5)

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })
  })

  hooks.afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  test('shows only supervisees', async function(assert) {
    await visit('/users')

    // 5 supervisees and the user himself
    assert.dom('table tr').exists({ count: 6 })
  })

  test('shows all to superuser', async function(assert) {
    let user = server.create('user', { isSuperuser: true })

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

    await visit('/users')

    // 12 users and the user himself
    assert.dom('table tr').exists({ count: 13 })
  })

  test('can filter and reset', async function(assert) {
    let user = server.create('user', { isSuperuser: true })

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

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
