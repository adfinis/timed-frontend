import { click, fillIn, currentURL, visit, waitFor } from '@ember/test-helpers'
import { authenticateSession } from 'ember-simple-auth/test-support'
import moment from 'moment'
import { module, test } from 'qunit'
import { setupApplicationTest } from 'ember-qunit'
import { setupMirage } from 'ember-cli-mirage/test-support'
import taskSelect from '../helpers/task-select'

module('Acceptance | index', function(hooks) {
  setupApplicationTest(hooks)
  setupMirage(hooks)

  hooks.beforeEach(async function() {
    let user = this.server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })

    this.user = user
  })

  test('can select a day', async function(assert) {
    await visit('/')

    await click('[data-test-previous]')

    let lastDay = moment().subtract(1, 'day')

    assert.equal(currentURL(), `/?day=${lastDay.format('YYYY-MM-DD')}`)

    await click('[data-test-today]')

    assert.equal(currentURL(), '/')
  })

  test('can start a new activity', async function(assert) {
    let task = this.server.create('task')
    await visit('/')

    await waitFor('.customer-select')
    await taskSelect('[data-test-tracking-bar]')

    await fillIn('[data-test-tracking-comment] input', 'Some Random Comment')

    assert.dom('[data-test-record-start]').exists({ count: 1 })

    await click('[data-test-record-start]')

    assert.dom('[data-test-record-start]').doesNotExist()
    assert.dom('[data-test-record-stop]').exists({ count: 1 })

    assert.dom('.recording').exists()
    assert
      .dom('[data-test-activity-row]:first-child td:nth-child(2) div')
      .containsText(task.name)
  })

  test('can start a new activity from the history', async function(assert) {
    let task = this.server.create('task')

    await visit('/')

    await waitFor('.customer-select')
    await taskSelect('[data-test-tracking-bar]', { fromHistory: true })

    await fillIn('[data-test-tracking-comment] input', 'Some Random Comment')

    await click('[data-test-record-start]')

    assert.dom('[data-test-record-start]').doesNotExist()
    assert.dom('[data-test-record-stop]').exists({ count: 1 })
    assert.dom('.recording [data-test-record-stop]').exists()
    assert
      .dom('[data-test-activity-row]:first-child td:nth-child(2) div')
      .containsText(task.name)
  })

  test('can stop an active activity', async function(assert) {
    let activity = this.server.create('activity', 'active', {
      userId: this.user.id
    })

    await visit('/')

    assert.dom('.recording [data-test-record-stop]').exists()
    assert.dom('[data-test-record-stop]').exists({ count: 1 })
    assert.dom('[data-test-tracking-comment] input').hasValue(activity.comment)

    await click('[data-test-record-stop]')

    assert.dom('[data-test-record-start]').exists({ count: 1 })
    assert.dom('[data-test-record-stop]').doesNotExist()
    assert.dom('.recording [data-test-record-start]').doesNotExist()
    assert.dom('[data-test-tracking-comment] input').hasNoValue()
  })

  test('can set the document title', async function(assert) {
    this.server.create('activity', 'active', { userId: this.user.id })

    await visit('/')

    assert.ok(/\d{2}:\d{2}:\d{2} \(.* > .* > .*\)/.test(document.title))
    await click('[data-test-record-stop]')

    assert.notOk(/\d{2}:\d{2}:\d{2} \(.* > .* > .*\)/.test(document.title))
  })

  test('can set the document title without task', async function(assert) {
    let activity = this.server.create('activity', 'active', {
      userId: this.user.id
    })
    activity.update('task', null)

    await visit('/')

    assert.ok(/\d{2}:\d{2}:\d{2} \(Unknown Task\)/.test(document.title))
  })

  test('can add an absence for multiple days and current day is preselected', async function(
    assert
  ) {
    this.server.loadFixtures('absence-types')

    await visit('/?day=2017-06-29')

    await click('[data-test-add-absence]')

    assert.dom('[data-test-add-absence-form]').exists({ count: 1 })

    await click('[data-test-add-absence-form] .btn-group .btn:first-child')

    await click('[data-date="2017-06-28"]')
    await click('[data-date="2017-06-30"]')

    await click('[data-test-add-absence-save]')

    assert.dom('[data-test-edit-absence]').isVisible()

    await click('[data-test-next]')

    assert.dom('[data-test-edit-absence]').isVisible()

    await click('[data-test-previous]')
    await click('[data-test-previous]')

    assert.dom('[data-test-edit-absence]').isVisible()
  })

  test('can edit an absence', async function(assert) {
    this.server.loadFixtures('absence-types')
    this.server.create('absence', {
      date: moment({ year: 2017, month: 5, day: 29 }).format('YYYY-MM-DD'),
      userId: this.user.id
    })

    await visit('/?day=2017-06-29')

    assert.dom('[data-test-edit-absence]').isVisible()

    await click('[data-test-edit-absence]')

    await click('[data-date="2017-06-30"]')

    await click('[data-test-edit-absence-save]')

    assert.dom('[data-test-edit-absence]').isNotVisible()

    await click('[data-test-next]')

    assert.dom('[data-test-edit-absence]').isVisible()
  })

  test('can delete an absence', async function(assert) {
    this.server.loadFixtures('absence-types')
    this.server.create('absence', {
      date: moment({ year: 2017, month: 5, day: 29 }).format('YYYY-MM-DD'),
      userId: this.user.id
    })

    await visit('/?day=2017-06-29')

    assert.dom('[data-test-edit-absence]').isVisible()

    await click('[data-test-edit-absence]')

    await click('[data-test-edit-absence-delete]')

    assert.dom('[data-test-edit-absence]').isNotVisible()
  })

  test('highlights holidays', async function(assert) {
    let date = moment({ year: 2017, month: 5, day: 29 }).format('YYYY-MM-DD')
    this.server.create('public-holiday', { date })
    await visit('/?day=2017-06-29')

    assert
      .dom('[data-test-weekly-overview-day="29"].holiday')
      .exists({ count: 1 })
    assert.dom('[data-test-weekly-overview-day="28"].holiday').doesNotExist()
  })

  test('rollbacks the absence modal', async function(assert) {
    await visit('/?day=2017-06-29')

    await click('[data-test-add-absence]')

    assert
      .dom('[data-date="2017-06-29"].ember-power-calendar-day--selected')
      .exists({ count: 1 })

    await click('[data-date="2017-06-30"]')

    assert
      .dom('[data-date="2017-06-30"].ember-power-calendar-day--selected')
      .exists({ count: 1 })

    await click('[data-test-add-absence-form] .close')

    await click('[data-test-add-absence]')

    assert
      .dom('[data-date="2017-06-30"].ember-power-calendar-day--selected')
      .doesNotExist()
  })
})
