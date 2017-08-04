import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import { describe, it, beforeEach, afterEach } from 'mocha'
import destroyApp from '../helpers/destroy-app'
import { expect } from 'chai'
import startApp from '../helpers/start-app'
import testSelector from 'ember-test-selectors'

describe('Acceptance | reschedule', function() {
  let application

  beforeEach(async function() {
    application = startApp()

    let user = server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

    server.createList('report', 6)
  })

  afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  it('can visit /reschedule', async function() {
    await visit('/reschedule')

    expect(currentURL()).to.equal('/reschedule')
  })

  it('can search and edit a report', async function() {
    await visit('/reschedule')
    await userSelect(testSelector('user-select'))
    await click(testSelector('search'))

    expect(find(`${testSelector('search-results')} tbody tr`).length).to.equal(
      6
    )
    fillIn(testSelector('report-comment', 0), 'Changed')
    await click(testSelector('report-save', 0))
    expect(find(testSelector('report-comment', 0)).val()).to.equal('Changed')
  })

  it('can reset the search params', async function() {
    await visit('/reschedule')
    await userSelect(testSelector('user-select'))
    await taskSelect(testSelector('tracking-customer'), { fromHistory: true })

    expect(find(`${testSelector('user-select')} input[name='user']`).val()).to
      .be.ok
    expect(
      find(`${testSelector('tracking-customer')} input[name='customer']`).val()
    ).to.be.ok
    await click(testSelector('reset'))
    expect(
      find(`${testSelector('user-select')} input[name='user']`).val()
    ).to.equal('')
    expect(
      find(`${testSelector('tracking-customer')} input[name='customer']`).val()
    ).to.equal('')
  })
})
