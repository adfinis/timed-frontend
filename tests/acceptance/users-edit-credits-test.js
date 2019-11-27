import { click, fillIn, currentURL, visit } from '@ember/test-helpers'
import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import destroyApp from '../helpers/destroy-app'
import startApp from '../helpers/start-app'
import moment from 'moment'
import { module, test } from 'qunit'

module('Acceptance | users edit credits', function(hooks) {
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

  test('can visit /users/:id/credits', async function(assert) {
    await visit(`/users/1/credits`)

    assert.dom('.card').exists({ count: 2 })
  })

  test('can change year', async function(assert) {
    let { employments: { models: [activeEmployment] } } = this.user

    await visit(`/users/1/credits`)

    assert
      .dom('select option:first-child')
      .hasText(activeEmployment.start.getFullYear().toString())

    assert.dom('select option:nth-last-child(2)').hasText(
      moment()
        .add(1, 'year')
        .year()
        .toString()
    )

    assert.dom('select option:last-child').hasText('All')

    await fillIn(
      'select',
      moment()
        .add(1, 'year')
        .year()
    )

    assert.dom(currentURL()).includesText(
      `year=${moment()
        .add(1, 'year')
        .year()}`
    )
  })

  test('can transfer', async function(assert) {
    await visit(`/users/1/credits?year=${moment().year() - 1}`)

    await click('.year-select .btn')

    assert.equal(currentURL(), '/users/1/credits')
  })
})
