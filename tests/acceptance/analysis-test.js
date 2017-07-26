import { authenticateSession, invalidateSession } from 'timed/tests/helpers/ember-simple-auth'
import { describe, it, beforeEach, afterEach }    from 'mocha'
import destroyApp                                 from '../helpers/destroy-app'
import { expect }                                 from 'chai'
import startApp                                   from '../helpers/start-app'
import testSelector                               from 'ember-test-selectors'

describe('Acceptance | analysis', function() {
  let application

  beforeEach(async function() {
    application = startApp()

    let user = server.create('user')

    await authenticateSession(application, { 'user_id': user.id })

    server.createList('report', 6)
  })

  afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  it('can visit /analysis', async function() {
    await visit('/analysis')

    expect(currentURL()).to.equal('/analysis')
  })

  it('can search and download analysis', async function() {
    await visit('/analysis')
    await userSelect(testSelector('user-select'))
    await click(testSelector('search'))

    expect(find(`${testSelector('search-results')} tbody tr`).length).to.equal(6)

    await click(testSelector('download-csv'))
    expect(currentURL()).to.equal('/analysis')
  })
})
