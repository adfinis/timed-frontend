import { currentURL, visit } from '@ember/test-helpers'
import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import { describe, it, beforeEach, afterEach } from 'mocha'
import destroyApp from '../helpers/destroy-app'
import { expect } from 'chai'
import startApp from '../helpers/start-app'
import { find } from 'ember-native-dom-helpers'

describe('Acceptance | users edit', function() {
  let application

  beforeEach(async function() {
    application = startApp()

    let user = server.create('user')

    this.allowed = server.create('user', { supervisorIds: [user.id] })
    this.notAllowed = server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })
  })

  afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  it('can visit /users/:id', async function() {
    await visit(`/users/${this.allowed.id}`)

    expect(currentURL()).to.contain(this.allowed.id)
  })

  it('shows only supervisees', async function() {
    await visit(`/users/${this.notAllowed.id}`)

    expect(find('.empty')).to.be.ok
    expect(find('.empty').innerHTML).to.contain('Halt')
  })

  it('allows all to superuser', async function() {
    let user = server.create('user', { isSuperuser: true })

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

    await visit(`/users/${this.notAllowed.id}`)

    expect(currentURL()).to.contain(this.notAllowed.id)
  })
})
