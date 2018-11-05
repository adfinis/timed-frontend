import { visit } from '@ember/test-helpers'
import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import { describe, it, beforeEach, afterEach } from 'mocha'
import destroyApp from '../helpers/destroy-app'
import { expect } from 'chai'
import startApp from '../helpers/start-app'
import { findAll } from 'ember-native-dom-helpers'

describe('Acceptance | users edit responsibilities', function() {
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

  it('can visit /users/:id/responsibilities', async function() {
    await visit(`/users/1/responsibilities`)

    expect(findAll('.card')).to.have.length(2)
  })
})
