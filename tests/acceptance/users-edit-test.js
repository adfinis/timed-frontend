import { currentURL, visit, find } from '@ember/test-helpers'
import { authenticateSession } from 'ember-simple-auth/test-support'
import { beforeEach, describe, it } from 'mocha'
import { setupApplicationTest } from 'ember-mocha'
import { expect } from 'chai'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'

describe('Acceptance | users edit', function() {
  let application = setupApplicationTest()
  setupMirage(application)

  beforeEach(async function() {
    let user = this.server.create('user')

    this.allowed = this.server.create('user', { supervisorIds: [user.id] })
    this.notAllowed = this.server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })
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
    let user = this.server.create('user', { isSuperuser: true })

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })

    await visit(`/users/${this.notAllowed.id}`)

    expect(currentURL()).to.contain(this.notAllowed.id)
  })
})
