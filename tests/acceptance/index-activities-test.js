import { click, find, findAll, currentURL, visit } from '@ember/test-helpers'
import { authenticateSession } from 'ember-simple-auth/test-support'
import { beforeEach, describe, it } from 'mocha'
import { setupApplicationTest } from 'ember-mocha'
import { expect } from 'chai'
import moment from 'moment'
import formatDuration from 'timed/utils/format-duration'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'

describe('Acceptance | index activities', function() {
  let application = setupApplicationTest()
  setupMirage(application)

  beforeEach(async function() {
    let user = this.server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })

    this.activities = this.server.createList('activity', 5, { userId: user.id })

    this.user = user
  })

  it('can visit /', async function() {
    await visit('/')

    expect(currentURL()).to.equal('/')
  })

  it('can list activities', async function() {
    await visit('/')

    expect(findAll('[data-test-activity-row]')).to.have.length(5)
  })

  it('can start an activity', async function() {
    await visit('/')

    await click(
      find('[data-test-activity-row-id="1"] [data-test-start-activity]')
    )

    expect(
      find('[data-test-activity-row-id="6"]').classList.contains('primary')
    ).to.be.ok
  })

  it('can start an activity of a past day', async function() {
    let lastDay = moment().subtract(1, 'day')

    let activity = this.server.create('activity', {
      date: lastDay,
      userId: this.user.id,
      comment: 'Test'
    })

    await visit(`/?day=${lastDay.format('YYYY-MM-DD')}`)

    await click(
      `[data-test-activity-row-id="${activity.id}"] [data-test-start-activity]`
    )

    expect(currentURL()).to.equal('/')

    expect(
      find('[data-test-activity-row-id="7"] td:nth-child(3)').innerText
    ).to.equals(activity.comment)
  })

  it('can stop an activity', async function() {
    await visit('/')

    await click(
      find('[data-test-activity-row-id="1"] [data-test-start-activity]')
    )

    expect(
      find('[data-test-activity-row-id="6"]').classList.contains('primary')
    ).to.be.ok

    await click(
      find('[data-test-activity-row-id="6"] [data-test-stop-activity]')
    )

    expect(
      find('[data-test-activity-row-id="6"]').classList.contains('primary')
    ).to.not.be.ok
  })

  it('can generate reports', async function() {
    let activity = this.server.create('activity', {
      userId: this.user.id,
      review: true,
      notBillable: true
    })
    let { id } = activity

    await visit('/')

    await click('[data-test-generate-timesheet]')

    expect(currentURL()).to.equal('/reports')

    expect(findAll('[data-test-report-row]')).to.have.length(7)

    expect(
      find(
        `[data-test-report-row-id="${id}"] .form-group:nth-child(1) .ember-power-select-selected-item`
      ).innerText.trim()
    ).to.equal(activity.task.project.customer.name)
    expect(
      find(
        `[data-test-report-row-id="${id}"] .form-group:nth-child(2) .ember-power-select-selected-item`
      ).innerText.trim()
    ).to.equal(activity.task.project.name)
    expect(
      find(
        `[data-test-report-row-id="${id}"] .form-group:nth-child(3) .ember-power-select-selected-item`
      ).innerText.trim()
    ).to.equal(activity.task.name)

    await visit('/')

    expect(
      find('[data-test-activity-row-id="1"]').classList.contains('transferred')
    ).to.be.ok
  })

  it('can not generate reports twice', async function() {
    await visit('/')

    await click('[data-test-generate-timesheet]')

    expect(currentURL()).to.equal('/reports')

    expect(findAll('[data-test-report-row]')).to.have.length(6)

    await visit('/')

    await click('[data-test-generate-timesheet]')

    expect(currentURL()).to.equal('/reports')

    expect(findAll('[data-test-report-row]')).to.have.length(6)
  })

  it('shows a warning when generating reports from unknown tasks', async function() {
    this.server.create('activity', 'unknown', { userId: this.user.id })

    await visit('/')

    await click('[data-test-generate-timesheet]')
    await click('[data-test-unknown-warning] .btn-default')

    expect(currentURL()).to.equal('/')

    await click('[data-test-generate-timesheet]')
    await click('[data-test-unknown-warning] .btn-primary')

    expect(currentURL()).to.equal('/reports')
  })

  it('shows a warning when generating reports from day overlapping activities', async function() {
    let date = moment().subtract(1, 'days')

    this.server.create('activity', 'active', { userId: this.user.id, date })

    await visit(`/?day=${date.format('YYYY-MM-DD')}`)

    await click('[data-test-generate-timesheet]')
    await click('[data-test-overlapping-warning] .btn-default')

    expect(currentURL()).to.not.contain('reports')

    await click('[data-test-generate-timesheet]')
    await click('[data-test-overlapping-warning] .btn-primary')

    expect(currentURL()).to.contain('reports')
  })

  it('can handle both warnings', async function() {
    let date = moment().subtract(1, 'days')

    this.server.create('activity', 'unknown', { userId: this.user.id, date })
    this.server.create('activity', 'active', { userId: this.user.id, date })

    await visit(`/?day=${date.format('YYYY-MM-DD')}`)

    // both close if one clicks cancel
    await click('[data-test-generate-timesheet]')
    expect(findAll('.modal--visible')).to.have.length(2)
    await click('[data-test-overlapping-warning] .btn-default')
    expect(findAll('.modal--visible')).to.have.length(0)
    expect(currentURL()).to.not.contain('reports')

    // both must be fine if it should continue
    await click('[data-test-generate-timesheet]')
    expect(findAll('.modal--visible')).to.have.length(2)
    await click('[data-test-overlapping-warning] .btn-primary')
    expect(findAll('.modal--visible')).to.have.length(1)
    await click('[data-test-unknown-warning] .btn-default')
    expect(findAll('.modal--visible')).to.have.length(0)

    await click('[data-test-generate-timesheet]')
    expect(findAll('.modal--visible')).to.have.length(2)
    await click('[data-test-unknown-warning] .btn-primary')
    expect(findAll('.modal--visible')).to.have.length(1)
    await click('[data-test-overlapping-warning] .btn-default')
    expect(findAll('.modal--visible')).to.have.length(0)
    expect(currentURL()).to.not.contain('reports')

    // if both are fine continue
    await click('[data-test-generate-timesheet]')
    expect(findAll('.modal--visible')).to.have.length(2)
    await click('[data-test-overlapping-warning] .btn-primary')
    expect(findAll('.modal--visible')).to.have.length(1)
    await click('[data-test-unknown-warning] .btn-primary')
    expect(findAll('.modal--visible')).to.have.length(0)
    expect(currentURL()).to.contain('reports')
  })

  it('splits 1 day overlapping activities when stopping', async function() {
    this.server.create('activity', 'active', {
      userId: this.user.id,
      date: moment().subtract(1, 'days')
    })

    await visit('/')

    await click('[data-test-record-stop]')

    // today block should be from 00:00 to now
    await click('[data-test-activity-row]:last-child')

    expect(
      find('[data-test-activity-time] td:first-child input').value
    ).to.equal('00:00')

    // yesterday block should be from old start time to 23:59
    await visit('/')
    await click('[data-test-previous]')

    await click('[data-test-activity-row]:first-child')

    expect(
      find('[data-test-activity-time] td:last-child input').value
    ).to.equal('23:59')
  })

  it("doesn't split >1 days overlapping activities when stopping", async function() {
    this.server.create('activity', 'active', {
      userId: this.user.id,
      date: moment().subtract(2, 'days')
    })

    await visit('/')

    await click('[data-test-record-stop]')

    // today activity should not exist
    expect(findAll('[data-test-activity-row]')).to.have.length(5)

    // yesterday activity should not exist
    await visit('/')
    await click('[data-test-previous]')

    expect(findAll('[data-test-activity-row]')).to.have.length(0)

    // day before yesterday activity should be from old start time to 23:59
    await visit('/')
    await click('[data-test-previous]')
    await click('[data-test-previous]')

    await click('[data-test-activity-row]:first-child')

    expect(
      find('[data-test-activity-time]:last-child td:last-child input').value
    ).to.equal('23:59')
  })

  it('can generate active reports which do not overlap', async function() {
    let activity = this.server.create('activity', 'active', {
      userId: this.user.id
    })
    let { id, duration } = activity

    duration = moment
      .duration(duration, 'HH:mm:ss')
      .add(moment().diff(moment(activity.fromTime, 'HH:mm:ss')))

    await visit('/')

    await click('[data-test-generate-timesheet]')

    expect(currentURL()).to.equal('/reports')

    expect(findAll('[data-test-report-row]')).to.have.length(7)

    expect(
      find(`${`[data-test-report-row-id="${id}"]`} [name=duration]`).value
    ).to.equal(formatDuration(duration, false))
  })

  it('combines identical activities when generating', async function() {
    let task = this.server.create('task')
    let activities = this.server.createList('activity', 3, 'defineTask', {
      userId: this.user.id,
      comment: 'Test',
      review: false,
      notBillable: false,
      definedTask: task.id
    })

    let duration = activities.reduce((acc, val) => {
      return acc.add(val.duration)
    }, moment.duration())

    await visit('/')

    await click('[data-test-generate-timesheet]')

    expect(currentURL()).to.equal('/reports')

    expect(findAll('[data-test-report-row]')).to.have.length(7)

    expect(
      find(`[data-test-report-row-id="6"] [name=duration]`).value
    ).to.equal(formatDuration(duration, false))
  })
})
