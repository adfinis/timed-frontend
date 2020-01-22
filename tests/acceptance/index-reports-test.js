import { click, fillIn, find, currentURL, visit } from '@ember/test-helpers'
import {
  authenticateSession,
  invalidateSession
} from 'ember-simple-auth/test-support'
import faker from 'faker'
import moment from 'moment'
import { module, test } from 'qunit'
import { setupApplicationTest } from 'ember-qunit'
import { setupMirage } from 'ember-cli-mirage/test-support'
import taskSelect from '../helpers/task-select'

module('Acceptance | index reports', function(hooks) {
  setupApplicationTest(hooks)
  setupMirage(hooks)

  hooks.beforeEach(async function() {
    let user = this.server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })

    this.server.createList('report', 5, { userId: user.id })

    this.user = user
  })

  hooks.afterEach(async function() {
    await invalidateSession()
  })

  test('can visit /reports', async function(assert) {
    await visit('/reports')

    assert.equal(currentURL(), '/reports')
  })

  test('can list reports', async function(assert) {
    await visit('/reports')

    // one row is for adding a new report
    assert.dom('[data-test-report-row]').exists({ count: 6 })
  })

  test('can add report', async function(assert) {
    await visit('/reports')

    await taskSelect('.form-list--reports .form-list-row:last-child')

    await fillIn(
      '.form-list--reports .form-list-row:last-child [data-test-report-duration]',
      '03:30'
    )
    await fillIn(
      '.form-list--reports .form-list-row:last-child [data-test-report-comment]',
      'Test comment report'
    )

    await click(
      '.form-list--reports .form-list-row:last-child [data-test-report-review]'
    )
    await click(
      '.form-list--reports .form-list-row:last-child [data-test-report-not-billable]'
    )

    await click(
      '.form-list--reports .form-list-row:last-child [data-test-save-report]'
    )

    assert
      .dom(
        '[data-test-report-row]:nth-last-child(2) [data-test-report-duration]'
      )
      .hasValue('03:30')
    assert
      .dom(
        '[data-test-report-row]:nth-last-child(2) [data-test-report-comment]'
      )
      .hasValue('Test comment report')
  })

  test('can edit report', async function(assert) {
    let { id } = this.server.create('report', { userId: this.user.id })

    await visit('/reports')

    assert
      .dom(`[data-test-report-row-id="${id}"] [data-test-save-report]`)
      .isDisabled()

    await fillIn(
      `[data-test-report-row-id="${id}"] [data-test-report-duration]`,
      '00:15'
    )
    await fillIn(
      `[data-test-report-row-id="${id}"] [data-test-report-comment]`,
      'Testyy'
    )

    assert
      .dom(`[data-test-report-row-id="${id}"] [data-test-save-report]`)
      .isNotDisabled()

    await click(`[data-test-report-row-id="${id}"] [data-test-save-report]`)

    assert
      .dom(`[data-test-report-row-id="${id}"] [data-test-save-report]`)
      .isDisabled()

    assert
      .dom(`[data-test-report-row-id="${id}"] [data-test-report-duration]`)
      .hasValue('00:15')
    assert
      .dom(`[data-test-report-row-id="${id}"] [data-test-report-comment]`)
      .hasValue('Testyy')
  })

  test('can delete report', async function(assert) {
    let { id } = this.server.create('report', { userId: this.user.id })

    await visit('/reports')

    assert.dom(`[data-test-report-row-id="${id}"]`).exists({ count: 1 })

    await click(`[data-test-report-row-id="${id}"] [data-test-delete-report]`)

    assert.dom(`[data-test-report-row-id="${id}"]`).doesNotExist()
  })

  test('reloads absences after saving or deleting a report', async function(
    assert
  ) {
    this.server.loadFixtures('absence-types')

    let absence = this.server.create('absence', { userId: this.user.id })
    let { id } = this.server.create('report', { userId: this.user.id })

    this.server.get('/absences/:id', ({ absences }, { params: { id } }) => {
      let absence = absences.find(id)

      absence.comment = faker.lorem.sentence()

      return absence
    })

    let { comment } = absence

    await visit('/reports')

    await click('[data-test-edit-absence]')
    assert.dom('[data-test-edit-absence-form] textarea').hasText(comment)
    await click('[data-test-edit-absence-form] button.close')

    await fillIn(
      `[data-test-report-row-id="${id}"] [data-test-report-comment]`,
      'test'
    )
    await click(`[data-test-report-row-id="${id}"] [data-test-save-report]`)

    await click('[data-test-edit-absence]')
    let c1 = find('[data-test-edit-absence-form] textarea').value
    await click('[data-test-edit-absence-form] button.close')

    assert.notEqual(c1, comment)

    await click(`[data-test-report-row-id="${id}"] [data-test-delete-report]`)

    await click('[data-test-edit-absence]')
    let c2 = find('[data-test-edit-absence-form] textarea').value
    await click('[data-test-edit-absence-form] button.close')

    assert.notEqual(c2, c1)
  })

  test('can reschedule reports', async function(assert) {
    let tomorrow = moment()
      .add(1, 'days')
      .format('YYYY-MM-DD')

    await visit('/reports')
    assert.dom('[data-test-report-row]').exists({ count: 6 })

    await click('[data-test-report-reschedule]')
    await click(`button[data-date="${tomorrow}"]`)
    await click('[data-test-report-save]')

    assert.equal(currentURL(), `/reports?day=${tomorrow}`)
    assert.dom('[data-test-report-row]').exists({ count: 6 })
  })
})
