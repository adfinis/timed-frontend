import { currentURL, visit } from '@ember/test-helpers'
import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import { describe, it, beforeEach, afterEach } from 'mocha'
import destroyApp from '../helpers/destroy-app'
import { expect } from 'chai'
import startApp from '../helpers/start-app'

describe('Acceptance | notfound', function() {
  let application

  beforeEach(async function() {
    application = startApp()
  })

  afterEach(async function() {
    destroyApp(application)
  })

  it('redirects to login for undefined routes if not logged in', async function() {
    await visit('/thiswillneverbeavalidrouteurl')

    expect(currentURL()).to.equal('/login')
  })

  it('displays a 404 page for undefined routes if logged in', async function() {
    let user = server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

    await visit('/thiswillneverbeavalidrouteurl')

    expect(find('[data-test-notfound]')).to.have.length(1)

    await invalidateSession(application)
  })
})
