import { visit, findAll } from '@ember/test-helpers'
import { authenticateSession } from 'ember-simple-auth/test-support'
import { beforeEach, describe, it } from 'mocha'
import { setupApplicationTest } from 'ember-mocha'
import { expect } from 'chai'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'

describe('Acceptance | users edit responsibilities', function() {
  let application = setupApplicationTest()
  setupMirage(application)

  beforeEach(async function() {
    this.user = this.server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: this.user.id })
  })

  it('can visit /users/:id/responsibilities', async function() {
    await visit(`/users/1/responsibilities`)

    expect(findAll('.card')).to.have.length(2)
  })
})
