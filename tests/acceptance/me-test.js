import { describe, it, beforeEach, afterEach }    from 'mocha'
import { expect }                                 from 'chai'
import { authenticateSession, invalidateSession } from 'timed/tests/helpers/ember-simple-auth'
import startApp                                   from '../helpers/start-app'
import destroyApp                                 from '../helpers/destroy-app'

describe('Acceptance | me', function() {
  let application

  beforeEach(async function() {
    application = startApp()

    let user = server.create('user')

    await authenticateSession(application, { 'user_id': user.id })
  })

  afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  it('can visit /me', async function() {
    await visit('/me')

    expect(currentURL()).to.equal('/me')
  })
})
