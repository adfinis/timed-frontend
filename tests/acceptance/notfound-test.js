import { describe, it, beforeEach, afterEach } from 'mocha'
import { expect }                              from 'chai'
import { authenticateSession, invalidateSession }                 from 'timed/tests/helpers/ember-simple-auth'
import startApp                                from '../helpers/start-app'
import destroyApp                              from '../helpers/destroy-app'
import testSelector                            from 'ember-test-selectors'

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
    await authenticateSession(application)

    await visit('/thiswillneverbeavalidrouteurl')

    expect(find(testSelector('notfound'))).to.have.length(1)

    await invalidateSession(application)
  })
})
