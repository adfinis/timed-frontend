import { click, fillIn, currentURL, visit } from '@ember/test-helpers'
import { authenticateSession } from 'ember-simple-auth/test-support'
import { beforeEach, describe, it } from 'mocha'
import { setupApplicationTest } from 'ember-mocha'
import { expect } from 'chai'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'

describe('Acceptance | auth', function() {
  let application = setupApplicationTest()
  setupMirage(application)

  beforeEach(function() {
    this.user = this.server.create('user', {
      firstName: 'John',
      lastName: 'Doe',
      password: '123qwe'
    })
  })

  it('prevents unauthenticated access', async function() {
    await visit('/')
    expect(currentURL()).to.equal('/login')
  })

  it('can login', async function() {
    await visit('/login')

    await fillIn('input[type=text]', 'johnd')
    await fillIn('input[type=password]', '123qwe')

    await click('button[type=submit]')

    expect(currentURL()).to.equal('/')
  })

  it('validates login', async function() {
    await visit('/login')

    await fillIn('input[type=text]', 'johnd')
    await fillIn('input[type=password]', '123123')

    await click('button[type=submit]')

    expect(currentURL()).to.equal('/login')

    await fillIn('input[type=text]', '')
    await fillIn('input[type=password]', '')

    await click('button[type=submit]')

    expect(currentURL()).to.equal('/login')
  })

  it('can logout', async function() {
    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: this.user.id })

    await visit('/')

    expect(currentURL()).to.equal('/')

    await click('[data-test-logout]')

    expect(currentURL()).to.equal('/login')
  })
})
