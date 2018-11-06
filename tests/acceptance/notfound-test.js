import { currentURL, visit } from '@ember/test-helpers'
import {
  authenticateSession,
  invalidateSession
} from 'ember-simple-auth/test-support'
import { describe, it } from 'mocha'
import { setupApplicationTest } from 'ember-mocha'
import { expect } from 'chai'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'

describe('Acceptance | notfound', function() {
  let application = setupApplicationTest()
  setupMirage(application)

  it('redirects to login for undefined routes if not logged in', async function() {
    await visit('/thiswillneverbeavalidrouteurl')

    expect(currentURL()).to.equal('/login')
  })

  it('displays a 404 page for undefined routes if logged in', async function() {
    let user = this.server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })

    await visit('/thiswillneverbeavalidrouteurl')

    expect(find('[data-test-notfound]')).to.have.length(1)

    await invalidateSession(application)
  })
})
