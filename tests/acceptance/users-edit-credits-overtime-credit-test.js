import { click, fillIn, currentURL, visit } from '@ember/test-helpers'
import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import destroyApp from '../helpers/destroy-app'
import startApp from '../helpers/start-app'
import moment from 'moment'
import { module, test } from 'qunit'

module('Acceptance | users edit credits overtime credit', function(hooks) {
  let application

  hooks.beforeEach(async function() {
    application = startApp()

    this.user = server.create('user', { isSuperuser: true })

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: this.user.id })
  })

  hooks.afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  test('can create an overtime credit', async function(assert) {
    await visit(`/users/${this.user.id}/credits/overtime-credits/new`)

    await fillIn('input[name=date]', moment().format('DD.MM.YYYY'))
    await fillIn('input[name=duration]', '20:00')
    await fillIn('input[name=comment]', 'Comment')

    await click('.btn-primary')

    assert.equal(currentURL(), `/users/${this.user.id}/credits`)

    assert.dom('[data-test-overtime-credits] tbody > tr').exists({ count: 1 })
  })

  test('can edit an overtime credit', async function(assert) {
    let { id } = server.create('overtime-credit', { user: this.user })

    await visit(`/users/${this.user.id}/credits`)

    await click('[data-test-overtime-credits] tbody > tr:first-child')

    assert.equal(
      currentURL(),
      `/users/${this.user.id}/credits/overtime-credits/${id}`
    )

    await fillIn('input[name=date]', moment().format('DD.MM.YYYY'))
    await fillIn('input[name=duration]', '20:00')
    await fillIn('input[name=comment]', 'Ding dong')

    await click('.btn-primary')

    assert.equal(currentURL(), `/users/${this.user.id}/credits`)

    assert.dom('[data-test-overtime-credits] tbody > tr').exists({ count: 1 })

    assert
      .dom(
        '[data-test-overtime-credits] tbody > tr:first-child > td:nth-child(1)'
      )
      .hasText(moment().format('DD.MM.YYYY'))

    assert
      .dom(
        '[data-test-overtime-credits] tbody > tr:first-child > td:nth-child(2)'
      )
      .hasText('20h 0m')

    assert
      .dom(
        '[data-test-overtime-credits] tbody > tr:first-child > td:nth-child(3)'
      )
      .hasText('Ding dong')
  })

  test('can delete an overtime credit', async function(assert) {
    let { id } = server.create('overtime-credit', { user: this.user })

    await visit(`/users/${this.user.id}/credits/overtime-credits/${id}`)

    await click('.btn-danger')

    assert.equal(currentURL(), `/users/${this.user.id}/credits`)

    assert.dom('[data-test-overtime-credits] tr').doesNotExist()
  })

  test('redirects to the year of the created overtime credit', async function(
    assert
  ) {
    await visit(`/users/${this.user.id}/credits/overtime-credits/new`)

    await fillIn(
      'input[name=date]',
      moment()
        .add(1, 'years')
        .format('DD.MM.YYYY')
    )
    await fillIn('input[name=duration]', '20:00')
    await fillIn('input[name=comment]', 'Ding dong')

    await click('.btn-primary')

    assert.equal(
      currentURL(),
      `/users/${this.user.id}/credits?year=${moment().year() + 1}`
    )
  })
})
