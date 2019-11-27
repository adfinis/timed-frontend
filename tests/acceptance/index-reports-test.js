import { click, fillIn, find, currentURL, visit } from '@ember/test-helpers'
import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import destroyApp from '../helpers/destroy-app'
import startApp from '../helpers/start-app'
import { faker } from 'ember-cli-mirage'
import moment from 'moment'
import { module, test } from 'qunit'

module('Acceptance | index reports', function(hooks) {
  let application

  hooks.beforeEach(async function() {
    application = startApp()

    let user = server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

    server.createList('report', 5, { userId: user.id })

    this.user = user
  })

  hooks.afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
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
      .hasText('03:30')
    assert
      .dom(
        '[data-test-report-row]:nth-last-child(2) [data-test-report-comment]'
      )
      .hasText('Test comment report')
  })

  test('can edit report', async function(assert) {
    let { id } = server.create('report', { userId: this.user.id })

    await visit('/reports')

    assert
      .dom(`${`[data-test-report-row-id="${id}"]`} [data-test-save-report]`)
      .isDisabled()

    await fillIn(
      `${`[data-test-report-row-id="${id}"]`} [data-test-report-duration]`,
      '00:15'
    )
    await fillIn(
      `${`[data-test-report-row-id="${id}"]`} [data-test-report-comment]`,
      'Testyy'
    )

    assert
      .dom(`${`[data-test-report-row-id="${id}"]`} [data-test-save-report]`)
      .isNotDisabled()

    await click(
      `${`[data-test-report-row-id="${id}"]`} [data-test-save-report]`
    )

    assert
      .dom(`${`[data-test-report-row-id="${id}"]`} [data-test-save-report]`)
      .isDisabled()

    assert
      .dom(`${`[data-test-report-row-id="${id}"]`} [data-test-report-duration]`)
      .hasText('00:15')
    assert
      .dom(`${`[data-test-report-row-id="${id}"]`} [data-test-report-comment]`)
      .hasText('Testyy')
  })

  test('can delete report', async function(assert) {
    let { id } = server.create('report', { userId: this.user.id })

    await visit('/reports')

    assert.dom(`[data-test-report-row-id="${id}"]`).exists({ count: 1 })

    await click(
      `${`[data-test-report-row-id="${id}"]`} [data-test-delete-report]`
    )

    assert.dom(`[data-test-report-row-id="${id}"]`).doesNotExist()
  })

  test('reloads absences after saving or deleting a report', async function(
    assert
  ) {
    server.loadFixtures('absence-types')

    let absence = server.create('absence', { userId: this.user.id })
    let { id } = server.create('report', { userId: this.user.id })

    server.get('/absences/:id', ({ absences }, { params: { id } }) => {
      let a = absences.find(id)

      a.comment = faker.lorem.sentence()

      return a
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

    await click(find('button:contains(Reschedule)'))
    await click(find(`button[data-date="${tomorrow}"]`))
    await click(find('button:contains(Save)'))

    assert.equal(currentURL(), `/reports?day=${tomorrow}`)
    assert.dom('[data-test-report-row]').exists({ count: 6 })
  })
})
