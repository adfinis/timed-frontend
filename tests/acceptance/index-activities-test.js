import { authenticateSession, invalidateSession } from 'timed/tests/helpers/ember-simple-auth'
import { describe, it, beforeEach, afterEach }    from 'mocha'
import destroyApp                                 from '../helpers/destroy-app'
import { expect }                                 from 'chai'
import startApp                                   from '../helpers/start-app'
import testSelector                               from 'ember-test-selectors'
import moment                                     from 'moment'

describe('Acceptance | index activities', function() {
  let application

  beforeEach(async function() {
    application = startApp()

    let user = server.create('user')

    await authenticateSession(application, { 'user_id': user.id })

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

  it('can not start an active activity', async function() {
    let [ { id } ] = this.activities

    await visit('/')

    await click(`${testSelector('activity-row-id', id)} ${testSelector('start-activity')}`)

    expect(find(testSelector('activity-row-id', id)).hasClass('primary')).to.be.ok
  })

  it('can start an activity', async function() {
    await visit('/')

    await click(find(`${testSelector('activity-row-id', 1)} ${testSelector('start-activity')}`))

    expect(find(testSelector('activity-row-id', 1)).hasClass('primary')).to.be.ok
  })

  it('can start an activity of a past day', async function() {
    let lastDay = moment().subtract(1, 'day')

    let activity = server.create('activity', { startDatetime: lastDay })

    await visit(`/?day=${lastDay.format('YYYY-MM-DD')}`)

    await click(`${testSelector('activity-row-id', activity.id)} ${testSelector('start-activity')}`)

    expect(currentURL()).to.equal('/')

    expect(find(`${testSelector('activity-row')}:last-child td:eq(1)`).text()).to.equal(activity.comment)
  })

  it('can stop an activity', async function() {
    await visit('/')

    await click(find(`${testSelector('activity-row-id', 1)} ${testSelector('start-activity')}`))

    expect(find(testSelector('activity-row-id', 1)).hasClass('primary')).to.be.ok

    await click(find(`${testSelector('activity-row-id', 1)} ${testSelector('stop-activity')}`))

    expect(find(testSelector('activity-row-id', 1)).hasClass('primary')).to.not.be.ok
  })

  it('can generate reports', async function() {
    let activity = server.create('activity', 'active')
    let { id }   = activity

    await visit('/')

    await click(find('button:contains(Generate timesheet)'))

    expect(currentURL()).to.equal('/reports')

    expect(find(testSelector('report-row'))).to.have.length(7)

    expect(find(`${testSelector('report-row-id', id)} td:eq(0) .tt-input`).val()).to.equal(activity.task.project.customer.name)
    expect(find(`${testSelector('report-row-id', id)} td:eq(1) .tt-input`).val()).to.equal(activity.task.project.name)
    expect(find(`${testSelector('report-row-id', id)} td:eq(2) .tt-input`).val()).to.equal(activity.task.name)
  })

  it('can not generate reports twice', async function() {
    await visit('/')

    await click(find('button:contains(Generate timesheet)'))

    expect(currentURL()).to.equal('/reports')

    expect(find(testSelector('report-row'))).to.have.length(6)

    await visit('/')

    await click(find('button:contains(Generate timesheet)'))

    expect(currentURL()).to.equal('/reports')

    expect(find(testSelector('report-row'))).to.have.length(6)
  })

  it('can update reports when generating', async function() {
    await server.db.activities.update(this.activities[0].id, { duration: '02:30:00' })

    await visit('/')

    await click(find('button:contains(Generate timesheet)'))

    expect(currentURL()).to.equal('/reports')

    expect(find(testSelector('report-row'))).to.have.length(6)

    expect(find(`${testSelector('report-row')}:eq(0) td:eq(3) input`).val()).to.equal('02:30')

    await server.db.activities.update(this.activities[0].id, { duration: '05:30:00' })

    await visit('/somenonexistentsite') // navigate away from index to reload the model
    await visit('/')

    await click(find('button:contains(Generate timesheet)'))

    expect(currentURL()).to.equal('/reports')

    expect(find(`${testSelector('report-row')}:eq(0) td:eq(3) input`).val()).to.equal('05:30')
  })

  it('shows a warning when generating reports from unknown tasks', async function() {
    server.create('activity', 'unknown')

    await visit('/')
    await click(find('button:contains(Generate reports)'))

    expect(currentURL()).to.equal('/')
  })
})
