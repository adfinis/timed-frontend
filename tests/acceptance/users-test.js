import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import { describe, it, beforeEach, afterEach } from 'mocha'
import destroyApp from '../helpers/destroy-app'
import { expect } from 'chai'
import startApp from '../helpers/start-app'

describe('Acceptance | users', function() {
  let application

  beforeEach(async function() {
    application = startApp()

    let user = server.create('user')

    server.createList('user', 5, { supervisorIds: [user.id] })
    server.createList('user', 5)

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })
  })

  afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  it('can visit /users', async function() {
    await visit('/users')

    expect(currentURL()).to.equal('/users')
  })

  it('shows only supervisees to staff', async function() {
    await visit('/users')

    expect(find('[data-test-user-row]')).to.have.length(5)
  })

  it('shows all to superuser', async function() {
    let user = server.create('user', { isSuperuser: true })

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

    await visit('/users')

    expect(find('[data-test-user-row]')).to.have.length(12)
  })

  it('can filter and reset', async function() {
    let user = server.create('user', { isSuperuser: true })

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

    await visit('/users')

    await click('input[type=checkbox]')
    await fillIn('input[type=search]', 'foobar')
    await selectSearch('.user-select', user.username)
    await userSelect()

    expect(currentURL()).to.equal('/users')

    await click('button:contains(Apply)')

    expect(currentURL()).to.contain('search=foobar')
    expect(currentURL()).to.contain('active=')
    expect(currentURL()).to.contain('supervisor=12')

    await click('button:contains(Reset)')

    expect(currentURL()).to.equal('/users')
  })
})
