import {
  click,
  fillIn,
  find,
  currentURL,
  blur,
  visit
} from '@ember/test-helpers'
import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import destroyApp from '../helpers/destroy-app'
import startApp from '../helpers/start-app'
import { module, test } from 'qunit'

module('Acceptance | index activities edit', function(hooks) {
  let application

  hooks.beforeEach(async function() {
    application = startApp()

    let user = server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

    server.createList('activity', 5, { userId: user.id })

    this.user = user
  })

  hooks.afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  test('can edit an activity', async function(assert) {
    await visit('/')

    await click(find('[data-test-activity-row-id="1"]'))

    assert.equal(currentURL(), '/edit/1')

    await taskSelect('[data-test-activity-edit-form]')

    await fillIn(
      '[data-test-activity-edit-form] [data-test-activity-block-row] td:nth-child(1) input',
      '03:30'
    )
    await fillIn(
      '[data-test-activity-edit-form] [data-test-activity-block-row] td:nth-child(3) input',
      '04:30'
    )

    await fillIn('[data-test-activity-edit-form] input[name=comment]', 'Test')

    await click(find('button:contains(Save)'))

    assert.equal(currentURL(), '/')

    assert.dom('[data-test-activity-row-id="1"]').includesText('Test')
  })

  test('can delete an activity', async function(assert) {
    await visit('/')

    await click('[data-test-activity-row-id="1"]')

    assert.equal(currentURL(), '/edit/1')

    await click(find('button:contains(Delete)'))

    assert.equal(currentURL(), '/')

    assert.dom('[data-test-activity-row-id="1"]').doesNotExist()
    assert.dom('[data-test-activity-row]').exists({ count: 4 })
  })

  test("can't delete an active activity", async function(assert) {
    let { id } = server.create('activity', 'active', { userId: this.user.id })

    await visit(`/edit/${id}`)

    await click(find('button:contains(Delete)'))

    assert.dom(find('button:contains(Delete)')).isDisabled()
    assert.dom(`[data-test-activity-row-id="${id}"]`).exists()
  })

  test('closes edit window when clicking on the currently edited activity row', async function(
    assert
  ) {
    await visit('/')

    await click('[data-test-activity-row-id="1"]')

    assert.equal(currentURL(), '/edit/1')

    await click('[data-test-activity-row-id="2"]')

    assert.equal(currentURL(), '/edit/2')

    await click('[data-test-activity-row-id="2"]')

    assert.equal(currentURL(), '/')
  })

  test('validates time on blur', async function(assert) {
    let { id } = server.create('activity', { userId: this.user.id })

    await visit(`/edit/${id}`)

    await fillIn(
      '[data-test-activity-block-row] td:nth-child(1) input',
      '02:30'
    )
    await fillIn(
      '[data-test-activity-block-row] td:nth-child(3) input',
      '01:30'
    )
    await blur('[data-test-activity-block-row] td:nth-child(3) input')

    assert
      .dom('[data-test-activity-block-row] td:nth-child(3)')
      .hasClass('has-error')

    await fillIn(
      '[data-test-activity-block-row] td:nth-child(1) input',
      '00:30'
    )
    await blur('[data-test-activity-block-row] td:nth-child(1) input')

    assert
      .dom('[data-test-activity-block-row] td:nth-child(3)')
      .doesNotHaveClass('has-error')
  })

  test('can not edit transferred activities', async function(assert) {
    let { id } = server.create('activity', {
      userId: this.user.id,
      transferred: true
    })
    await visit(`/edit/${id}`)
    assert.equal(currentURL(), '/')
  })
})
