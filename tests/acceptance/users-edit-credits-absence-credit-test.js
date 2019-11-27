import { click, fillIn, currentURL, visit } from '@ember/test-helpers'
import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import destroyApp from '../helpers/destroy-app'
import startApp from '../helpers/start-app'
import moment from 'moment'
import { module, test } from 'qunit'

module('Acceptance | users edit credits absence credit', function(hooks) {
  let application

  hooks.beforeEach(async function() {
    application = startApp()

    this.user = server.create('user', { isSuperuser: true })
    this.types = server.loadFixtures('absence-types')

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: this.user.id })
  })

  hooks.afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  test('can create an absence credit', async function(assert) {
    await visit(`/users/${this.user.id}/credits/absence-credits/new`)

    await click('.btn-group .btn:first-child')
    await fillIn('input[name=date]', moment().format('DD.MM.YYYY'))
    await fillIn('input[name=days]', '5')
    await fillIn('input[name=comment]', 'Comment')

    await click('.btn-primary')

    assert.equal(currentURL(), `/users/${this.user.id}/credits`)

    assert.dom('[data-test-absence-credits] tbody > tr').exists({ count: 1 })
  })

  test('can edit an absence credit', async function(assert) {
    let { id } = server.create('absence-credit', { user: this.user })

    await visit(`/users/${this.user.id}/credits`)

    await click('[data-test-absence-credits] tbody > tr:first-child')

    assert.equal(
      currentURL(),
      `/users/${this.user.id}/credits/absence-credits/${id}`
    )

    await fillIn('input[name=date]', moment().format('DD.MM.YYYY'))
    await fillIn('input[name=days]', '5')
    await fillIn('input[name=comment]', 'Ding dong')

    await click('.btn-primary')

    assert.equal(currentURL(), `/users/${this.user.id}/credits`)

    assert.dom('[data-test-absence-credits] tbody > tr').exists({ count: 1 })

    assert
      .dom(
        '[data-test-absence-credits] tbody > tr:first-child > td:nth-child(1)'
      )
      .hasText(moment().format('DD.MM.YYYY'))

    assert
      .dom(
        '[data-test-absence-credits] tbody > tr:first-child > td:nth-child(2)'
      )
      .hasText('5')

    assert
      .dom(
        '[data-test-absence-credits] tbody > tr:first-child > td:nth-child(4)'
      )
      .hasText('Ding dong')
  })

  test('can delete an absence credit', async function(assert) {
    let { id } = server.create('absence-credit', { user: this.user })

    await visit(`/users/${this.user.id}/credits/absence-credits/${id}`)

    await click('.btn-danger')

    assert.equal(currentURL(), `/users/${this.user.id}/credits`)

    assert.dom('[data-test-absence-credits] tr').doesNotExist()
  })

  test('redirects to the year of the created absence credit', async function(
    assert
  ) {
    await visit(`/users/${this.user.id}/credits/absence-credits/new`)

    await click('.btn-group .btn:first-child')
    await fillIn(
      'input[name=date]',
      moment()
        .add(1, 'years')
        .format('DD.MM.YYYY')
    )
    await fillIn('input[name=days]', '5')
    await fillIn('input[name=comment]', 'Comment')

    await click('.btn-primary')

    assert.equal(
      currentURL(),
      `/users/${this.user.id}/credits?year=${moment().year() + 1}`
    )
  })
})
