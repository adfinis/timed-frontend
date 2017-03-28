import { authenticateSession, invalidateSession } from 'timed/tests/helpers/ember-simple-auth'
import { describe, it, beforeEach, afterEach }    from 'mocha'
import destroyApp                                 from '../helpers/destroy-app'
import { expect }                                 from 'chai'
import startApp                                   from '../helpers/start-app'
import testSelector                               from 'ember-test-selectors'

describe('Acceptance | index activities', function() {
  let application

  beforeEach(async function() {
    application = startApp()
    await authenticateSession(application)

    this.activities = server.createList('activity', 5)
  })

  afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  it('can visit /', async function() {
    await visit('/')

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

  it('can generate reports', async function() {
    let activity = server.create('activity', 'active')

    await visit('/')

    await click(find('button:contains(Generate reports)'))

    expect(currentURL()).to.equal('/reports')

    expect(find(testSelector('report-row'))).to.have.length(6)

    expect(find(`${testSelector('report-row')}:eq(0) td:eq(0)`).text()).to.contain(activity.task.name)
    expect(find(`${testSelector('report-row')}:eq(0) td:eq(0)`).text()).to.contain(activity.task.project.name)
    expect(find(`${testSelector('report-row')}:eq(0) td:eq(0)`).text()).to.contain(activity.task.project.customer.name)
  })

  it('does not generate reports twice', async function() {
    await visit('/')

    await click(find('button:contains(Generate reports)'))

    expect(currentURL()).to.equal('/reports')

    expect(find(testSelector('report-row'))).to.have.length(5)

    await visit('/')

    await click(find('button:contains(Generate reports)'))

    expect(currentURL()).to.equal('/reports')

    expect(find(testSelector('report-row'))).to.have.length(5)
  })

  it('updates reports when generating', async function() {
    await server.db.activities.update(this.activities[0].id, { duration: '02:30:00' })

    await visit('/')

    await click(find('button:contains(Generate reports)'))

    expect(currentURL()).to.equal('/reports')

    expect(find(testSelector('report-row'))).to.have.length(5)

    expect(find(`${testSelector('report-row')}:eq(0) td:eq(2)`).text().trim()).to.equal('02:30')

    await server.db.activities.update(this.activities[0].id, { duration: '05:30:00' })

    await visit('/somenonexistentsite') // navigate away from index to reload the model
    await visit('/')

    await click(find('button:contains(Generate reports)'))

    expect(currentURL()).to.equal('/reports')

    expect(find(`${testSelector('report-row')}:eq(0) td:eq(2)`).text().trim()).to.equal('05:30')
  })
})
