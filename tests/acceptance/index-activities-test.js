import { authenticateSession, invalidateSession } from 'timed/tests/helpers/ember-simple-auth'
import { describe, it, beforeEach, afterEach }    from 'mocha'
import destroyApp                                 from '../helpers/destroy-app'
import { expect }                                 from 'chai'
import { percySnapshot }                          from 'ember-percy'
import startApp                                   from '../helpers/start-app'
import testSelector                               from 'ember-test-selectors'

describe('Acceptance | index activities', function() {
  let application

  beforeEach(async function() {
    application = startApp()
    await authenticateSession(application)

    server.createList('activity', 5)
  })

  afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  it('can visit /', async function() {
    await visit('/')

    percySnapshot('activities')

    expect(currentURL()).to.equal('/')
  })

  it('can list activities', async function() {
    await visit('/')

    expect(find(testSelector('activity-row'))).to.have.length(5)
  })

  it('can start an activity by clicking on the row', async function() {
    await visit('/')

    await triggerEvent(find(testSelector('activity-row-id', 1)), 'dblclick')

    expect(find(testSelector('activity-row-id', 1)).hasClass('primary')).to.be.ok
  })

  it('can\'t start an active activity', async function() {
    await visit('/')

    await click(find(`${testSelector('activity-row-id', 1)} ${testSelector('start-activity')}`))

    expect(find(testSelector('activity-row-id', 1)).hasClass('primary')).to.be.ok

    await triggerEvent(find(testSelector('activity-row-id', 1)), 'dblclick')

    expect(find(testSelector('activity-row-id', 1)).hasClass('primary')).to.be.ok
  })

  it('can start an activity by clicking on the play button', async function() {
    await visit('/')

    await click(find(`${testSelector('activity-row-id', 1)} ${testSelector('start-activity')}`))

    expect(find(testSelector('activity-row-id', 1)).hasClass('primary')).to.be.ok
  })

  it('can stop an activity', async function() {
    await visit('/')

    await click(find(`${testSelector('activity-row-id', 1)} ${testSelector('start-activity')}`))

    expect(find(testSelector('activity-row-id', 1)).hasClass('primary')).to.be.ok

    await click(find(`${testSelector('activity-row-id', 1)} ${testSelector('stop-activity')}`))

    expect(find(testSelector('activity-row-id', 1)).hasClass('primary')).to.not.be.ok
  })

  it('can delete an activity', async function() {
    await visit('/')

    await click(find(`${testSelector('activity-row-id', 1)} ${testSelector('delete-activity')}`))

    expect(find(testSelector('activity-row-id', 1))).to.have.length(0)
    expect(find(testSelector('activity-row'))).to.have.length(4)
  })
})
