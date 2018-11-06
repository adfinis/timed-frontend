import { click, fillIn, find, currentURL, visit } from '@ember/test-helpers'
import { authenticateSession } from 'ember-simple-auth/test-support'
import { beforeEach, describe, it } from 'mocha'
import { setupApplicationTest } from 'ember-mocha'
import { expect } from 'chai'
import moment from 'moment'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'
import taskSelect from 'timed/tests/helpers/task-select'

describe('Acceptance | index', function() {
  let application = setupApplicationTest()
  setupMirage(application)

  beforeEach(async function() {
    let user = this.server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })

    this.user = user
  })

  it('can select a day', async function() {
    await visit('/')

    await click('[data-test-previous]')

    let lastDay = moment().subtract(1, 'day')

    expect(currentURL()).to.equal(`/?day=${lastDay.format('YYYY-MM-DD')}`)

    await click('[data-test-today]')

    expect(currentURL()).to.equal('/')
  })

  it('can start a new activity', async function() {
    let task = this.server.create('task')
    await visit('/')

    await taskSelect('[data-test-tracking-bar]')

    await fillIn('[data-test-tracking-comment]', 'Some Random Comment')

    expect(find('[data-test-record-start]')).to.have.length(1)

    await click('[data-test-record-start]')

    expect(find('[data-test-record-start]')).to.have.length(0)
    expect(find('[data-test-record-stop]')).to.have.length(1)
    expect(
      find('[data-test-record-stop]')
        .parent()
        .parent()
        .hasClass('recording')
    ).to.be.ok
    expect(
      find('[data-test-activity-row]:first-child td:eq(1) div').text()
    ).to.contain(task.name)
  })

  it('can start a new activity from the history', async function() {
    let task = this.server.create('task')

    await visit('/')

    await taskSelect('[data-test-tracking-bar]', { fromHistory: true })

    await fillIn('[data-test-tracking-comment]', 'Some Random Comment')

    await click('[data-test-record-start]')

    expect(find('[data-test-record-start]')).to.have.length(0)
    expect(find('[data-test-record-stop]')).to.have.length(1)
    expect(
      find('[data-test-record-stop]')
        .parent()
        .parent()
        .hasClass('recording')
    ).to.be.ok
    expect(
      find('[data-test-activity-row]:first-child td:eq(1) div').text()
    ).to.contain(task.name)
  })

  it('can stop an active activity', async function() {
    let activity = this.server.create('activity', 'active', {
      userId: this.user.id
    })

    await visit('/')

    expect(
      find('[data-test-record-stop]')
        .parent()
        .parent()
        .hasClass('recording')
    ).to.be.ok
    expect(find('[data-test-record-stop]')).to.have.length(1)
    expect(find('[data-test-tracking-comment] input').val()).to.equal(
      activity.comment
    )

    await click('[data-test-record-stop]')

    expect(find('[data-test-record-start]')).to.have.length(1)
    expect(find('[data-test-record-stop]')).to.have.length(0)
    expect(
      find('[data-test-record-start]')
        .parent()
        .parent()
        .hasClass('recording')
    ).to.not.be.ok
    expect(find('[data-test-tracking-comment] input').val()).to.equal('')
  })

  it('can set the document title', async function() {
    this.server.create('activity', 'active', { userId: this.user.id })

    await visit('/')

    expect(document.title).to.match(/\d{2}:\d{2}:\d{2} \(.* > .* > .*\)/)

    await click('[data-test-record-stop]')

    expect(document.title).to.not.match(/\d{2}:\d{2}:\d{2} \(.* > .* > .*\)/)
  })

  it('can set the document title without task', async function() {
    let a = this.server.create('activity', 'active', { userId: this.user.id })
    a.update('task', null)

    await visit('/')

    expect(document.title).to.match(/\d{2}:\d{2}:\d{2} \(Unknown Task\)/)
  })

  it('can add an absence for multiple days and current day is preselected', async function() {
    this.server.loadFixtures('absence-types')

    await visit('/?day=2017-06-29')

    await click('[data-test-add-absence]')

    expect(find('[data-test-add-absence-form]')).to.have.length(1)

    await click('[data-test-add-absence-form] .btn-group .btn:first-child')

    await click(find('[data-date=2017-06-28]'))
    await click(find('[data-date=2017-06-30]'))

    await click('[data-test-add-absence-form] button:contains(Save)')

    expect(find('[data-test-edit-absence]:visible')).to.have.length(1)

    await click('[data-test-next]')

    expect(find('[data-test-edit-absence]:visible')).to.have.length(1)

    await click('[data-test-previous]')
    await click('[data-test-previous]')

    expect(find('[data-test-edit-absence]:visible')).to.have.length(1)
  })

  it('can edit an absence', async function() {
    this.server.loadFixtures('absence-types')
    this.server.create('absence', {
      date: moment({ year: 2017, month: 5, day: 29 }).format('YYYY-MM-DD'),
      userId: this.user.id
    })

    await visit('/?day=2017-06-29')

    expect(find('[data-test-edit-absence]:visible')).to.have.length(1)

    await click('[data-test-edit-absence]')

    await click(find('[data-date=2017-06-30]'))

    await click('[data-test-edit-absence-form] button:contains(Save)')

    expect(find('[data-test-edit-absence]:visible')).to.have.length(0)

    await click('[data-test-next]')

    expect(find('[data-test-edit-absence]:visible')).to.have.length(1)
  })

  it('can delete an absence', async function() {
    this.server.loadFixtures('absence-types')
    this.server.create('absence', {
      date: moment({ year: 2017, month: 5, day: 29 }).format('YYYY-MM-DD'),
      userId: this.user.id
    })

    await visit('/?day=2017-06-29')

    expect(find('[data-test-edit-absence]:visible')).to.have.length(1)

    await click('[data-test-edit-absence]')

    await click('[data-test-edit-absence-form] button:contains(Delete)')

    expect(find('[data-test-edit-absence]:visible')).to.have.length(0)
  })

  it('highlights holidays', async function() {
    let date = moment({ year: 2017, month: 5, day: 29 }).format('YYYY-MM-DD')
    this.server.create('public-holiday', { date })
    await visit('/?day=2017-06-29')

    expect(find('[data-test-weekly-overview-day=29].holiday')).to.have.length(1)
    expect(find('[data-test-weekly-overview-day=28].holiday')).to.have.length(0)
  })

  it('rollbacks the absence modal', async function() {
    await visit('/?day=2017-06-29')

    await click('[data-test-add-absence]')

    expect(
      find('[data-date=2017-06-29].ember-power-calendar-day--selected')
    ).to.have.length(1)

    await click('[data-date=2017-06-30]')

    expect(
      find('[data-date=2017-06-30].ember-power-calendar-day--selected')
    ).to.have.length(1)

    await click('[data-test-add-absence-form] .close')

    await click('[data-test-add-absence]')

    expect(
      find('[data-date=2017-06-30].ember-power-calendar-day--selected')
    ).to.have.length(0)
  })
})
