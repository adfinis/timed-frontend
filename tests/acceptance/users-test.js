import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import { describe, it, beforeEach, afterEach } from 'mocha'
import destroyApp from '../helpers/destroy-app'
import { expect } from 'chai'
import { findAll } from 'ember-native-dom-helpers'
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

    // 5 supervisees and the user himself
    expect(findAll('table tr')).to.have.length(6)
  })

  it('shows all to superuser', async function() {
    let user = server.create('user', { isSuperuser: true })

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

    await visit('/users')

    // 12 users and the user himself
    expect(findAll('table tr')).to.have.length(13)
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

    expect(currentURL()).to.contain('search=foobar')
    expect(currentURL()).to.contain('active=')
    expect(currentURL()).to.contain('supervisor=12')

    await click('button:contains(Reset filter)')

    expect(currentURL()).to.equal('/users')
  })
})
