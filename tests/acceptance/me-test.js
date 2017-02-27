import { authenticateSession, invalidateSession } from 'timed/tests/helpers/ember-simple-auth'
import { describe, it, beforeEach, afterEach }    from 'mocha'
import destroyApp                                 from '../helpers/destroy-app'
import { expect }                                 from 'chai'
import { percySnapshot }                          from 'ember-percy'
import startApp                                   from '../helpers/start-app'

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

    percySnapshot('me')

    expect(currentURL()).to.equal('/me')
  })
})
