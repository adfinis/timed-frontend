import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import { describe, it, beforeEach, afterEach } from 'mocha'
import destroyApp from '../helpers/destroy-app'
import { expect } from 'chai'
import startApp from '../helpers/start-app'
import moment from 'moment'

describe('Acceptance | index activities', function() {
  let application

  beforeEach(async function() {
    application = startApp()

    let user = server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

    this.activities = server.createList('activity', 5, { userId: user.id })

    this.user = user
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

    expect(find('[data-test-activity-row]')).to.have.length(5)
  })

  it('can not start an active activity', async function() {
    let [{ id }] = this.activities

    await visit('/')

    await click(
      `${`[data-test-activity-row-id="${id}"]`} [data-test-start-activity]`
    )

    expect(find(`[data-test-activity-row-id="${id}"]`).hasClass('primary')).to
      .be.ok
  })

  it('can start an activity', async function() {
    await visit('/')

    await click(
      find('[data-test-activity-row-id="1"] [data-test-start-activity]')
    )

    expect(find('[data-test-activity-row-id="1"]').hasClass('primary')).to.be.ok
  })

  it('can start an activity of a past day', async function() {
    let lastDay = moment().subtract(1, 'day')

    let activity = server.create('activity', {
      date: lastDay,
      userId: this.user.id
    })

    await visit(`/?day=${lastDay.format('YYYY-MM-DD')}`)

    await click(
      `[data-test-activity-row-id="${activity.id}"] [data-test-start-activity]`
    )

    expect(currentURL()).to.equal('/')

    expect(
      find('[data-test-activity-row]:last-child td:eq(1)').text()
    ).to.equal(activity.comment)
  })

  it('can stop an activity', async function() {
    await visit('/')

    await click(
      find('[data-test-activity-row-id="1"] [data-test-start-activity]')
    )

    expect(find('[data-test-activity-row-id="1"]').hasClass('primary')).to.be.ok

    await click(
      find('[data-test-activity-row-id="1"] [data-test-stop-activity]')
    )

    expect(find('[data-test-activity-row-id="1"]').hasClass('primary')).to.not
      .be.ok
  })

  it('can generate reports', async function() {
    let activity = server.create('activity', { userId: this.user.id })
    let { id } = activity

    await visit('/')

    await click(find('button:contains(Generate timesheet)'))

    expect(currentURL()).to.equal('/reports')

    expect(find('[data-test-report-row]')).to.have.length(7)

    expect(
      find(
        `${`[data-test-report-row-id="${id}"]`} .form-group:eq(0) .ember-power-select-selected-item`
      )
        .text()
        .trim()
    ).to.equal(activity.task.project.customer.name)
    expect(
      find(
        `${`[data-test-report-row-id="${id}"]`} .form-group:eq(1) .ember-power-select-selected-item`
      )
        .text()
        .trim()
    ).to.equal(activity.task.project.name)
    expect(
      find(
        `${`[data-test-report-row-id="${id}"]`} .form-group:eq(2) .ember-power-select-selected-item`
      )
        .text()
        .trim()
    ).to.equal(activity.task.name)
  })

  it('can not generate reports twice', async function() {
    await visit('/')

    await click(find('button:contains(Generate timesheet)'))

    expect(currentURL()).to.equal('/reports')

    expect(find('[data-test-report-row]')).to.have.length(6)

    await visit('/')

    await click(find('button:contains(Generate timesheet)'))

    expect(currentURL()).to.equal('/reports')

    expect(find('[data-test-report-row]')).to.have.length(6)
  })

  it('can update reports when generating', async function() {
    await server.db.activities.update(this.activities[0].id, {
      duration: '02:30:00'
    })

    await visit('/')

    await click(find('button:contains(Generate timesheet)'))

    expect(currentURL()).to.equal('/reports')

    expect(find('[data-test-report-row]')).to.have.length(6)

    expect(
      find('[data-test-report-row]:eq(0) .form-group:eq(4) input').val()
    ).to.equal('02:30')

    await server.db.activities.update(this.activities[0].id, {
      duration: '05:30:00'
    })

    await visit('/somenonexistentsite') // navigate away from index to reload the model
    await visit('/')

    await click(find('button:contains(Generate timesheet)'))

    expect(currentURL()).to.equal('/reports')

    expect(
      find('[data-test-report-row]:eq(0) .form-group:eq(4) input').val()
    ).to.equal('05:30')
  })

  it('shows a warning when generating reports from unknown tasks', async function() {
    server.create('activity', 'unknown', { userId: this.user.id })

    await visit('/')

    await click('button:contains(Generate timesheet)')
    await click('[data-test-unknown-warning] button:contains(Cancel)')

    expect(currentURL()).to.equal('/')

    await click('button:contains(Generate timesheet)')
    await click('[data-test-unknown-warning] button:contains(fine)')

    expect(currentURL()).to.equal('/reports')
  })

  it('shows a warning when generating reports from active activities', async function() {
    server.create('activity', 'active', { userId: this.user.id })

    await visit('/')

    await click('button:contains(Generate timesheet)')
    await click('[data-test-active-warning] button:contains(Cancel)')

    expect(currentURL()).to.equal('/')

    await click('button:contains(Generate timesheet)')
    await click('[data-test-active-warning] button:contains(fine)')

    expect(currentURL()).to.equal('/reports')
  })

  it('can handle both warnings', async function() {
    server.create('activity', 'unknown', { userId: this.user.id })
    server.create('activity', 'active', { userId: this.user.id })

    await visit('/')

    // both close if one clicks cancel
    await click('button:contains(Generate timesheet)')
    expect(find('.modal--visible')).to.have.length(2)
    await click('[data-test-active-warning] button:contains(Cancel)')
    expect(find('.modal--visible')).to.have.length(0)
    expect(currentURL()).to.equal('/')

    // both must be fine if it should continue
    await click('button:contains(Generate timesheet)')
    expect(find('.modal--visible')).to.have.length(2)
    await click('[data-test-active-warning] button:contains(fine)')
    expect(find('.modal--visible')).to.have.length(1)
    await click('[data-test-unknown-warning] button:contains(Cancel)')
    expect(find('.modal--visible')).to.have.length(0)

    await click('button:contains(Generate timesheet)')
    expect(find('.modal--visible')).to.have.length(2)
    await click('[data-test-unknown-warning] button:contains(fine)')
    expect(find('.modal--visible')).to.have.length(1)
    await click('[data-test-active-warning] button:contains(Cancel)')
    expect(find('.modal--visible')).to.have.length(0)
    expect(currentURL()).to.equal('/')

    // if both are fine continue
    await click('button:contains(Generate timesheet)')
    expect(find('.modal--visible')).to.have.length(2)
    await click('[data-test-active-warning] button:contains(fine)')
    expect(find('.modal--visible')).to.have.length(1)
    await click('[data-test-unknown-warning] button:contains(fine)')
    expect(find('.modal--visible')).to.have.length(0)
    expect(currentURL()).to.equal('/reports')
  })

  it('splits overlapping activities when stopping', async function() {
    let activity = server.create('activity', 'active', {
      userId: this.user.id,
      date: moment().subtract(2, 'days')
    })

    await visit('/')

    await click('[data-test-record-stop]')

    // todayday block should be from 00:00 to now
    expect(find(`[data-test-activity-row] td:contains(${activity.comment})`)).to
      .be.ok

    await click(`[data-test-activity-row] td:contains(${activity.comment})`)

    expect(
      find('[data-test-activity-block-row] td:eq(1) input').val()
    ).to.equal('00:00')

    // yesterday block should be from 00:00 to now
    await visit('/')
    await click('[data-test-previous]')

    expect(find(`[data-test-activity-row] td:contains(${activity.comment})`)).to
      .be.ok

    await click(`[data-test-activity-row] td:contains(${activity.comment})`)

    expect(
      find('[data-test-activity-block-row] td:eq(1) input').val()
    ).to.equal('00:00')

    expect(
      find('[data-test-activity-block-row] td:eq(3) input').val()
    ).to.equal('23:59')

    // day before yesterday block should be from old start time to 23:59
    await visit('/')
    await click('[data-test-previous]')
    await click('[data-test-previous]')

    expect(find(`[data-test-activity-row] td:contains(${activity.comment})`)).to
      .be.ok

    await click(`[data-test-activity-row] td:contains(${activity.comment})`)

    expect(
      find('[data-test-activity-block-row]:last td:eq(3) input').val()
    ).to.equal('23:59')
  })
})
