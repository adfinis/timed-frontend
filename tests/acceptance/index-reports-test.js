import { describe, it, beforeEach, afterEach }    from 'mocha'
import { expect }                                 from 'chai'
import startApp                                   from '../helpers/start-app'
import destroyApp                                 from '../helpers/destroy-app'
import { authenticateSession, invalidateSession } from 'timed/tests/helpers/ember-simple-auth'
import testSelector                               from 'ember-test-selectors'

describe('Acceptance | index reports', function() {
  let application

  beforeEach(async function() {
    application = startApp()
    await authenticateSession(application)

    server.createList('report', 5)
  })

  afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  it('can visit /reports', async function() {
    await visit('/reports')

    expect(currentURL()).to.equal('/reports')
  })

  it('can list reports', async function() {
    await visit('/reports')

    expect(find(testSelector('report-row'))).to.have.length(5)
  })
})
