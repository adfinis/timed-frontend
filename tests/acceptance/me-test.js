import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import { describe, it, beforeEach, afterEach } from 'mocha'
import destroyApp from '../helpers/destroy-app'
import { expect } from 'chai'
import startApp from '../helpers/start-app'

describe('Acceptance | me', function() {
  let application

  beforeEach(async function() {
    application = startApp()

    this.user = server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: this.user.id })
  })

  afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  it('redirects to user profile', async function() {
    await visit('/me')

    expect(currentURL()).to.equal(`/users/${this.user.id}`)
  })
})
