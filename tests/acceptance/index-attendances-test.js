import { click, currentURL, visit, find } from '@ember/test-helpers'
import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import destroyApp from '../helpers/destroy-app'
import startApp from '../helpers/start-app'
import { module, test } from 'qunit'

module('Acceptance | index attendances', function(hooks) {
  let application

  hooks.beforeEach(async function() {
    application = startApp()

    let user = server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

    server.create('attendance', 'morning', { userId: user.id })
    server.create('attendance', 'afternoon', { userId: user.id })
  })

  hooks.afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  test('can visit /attendances', async function(assert) {
    await visit('/attendances')

    assert.equal(currentURL(), '/attendances')
  })

  test('can list attendances', async function(assert) {
    await visit('/attendances')

    assert.dom('[data-test-attendance-slider]').exists({ count: 2 })
  })

  test('can save an attendances', async function(assert) {
    await visit('/attendances')

    assert.dom('[data-test-attendance-slider]').exists({ count: 2 })

    await click('[data-test-attendance-slider-id="1"] .noUi-draggable')

    assert.dom('[data-test-attendance-slider]').exists({ count: 2 })
  })

  test('can add an attendance', async function(assert) {
    await visit('/attendances')

    await click('[data-test-add-attendance]')

    assert.dom('[data-test-attendance-slider]').exists({ count: 3 })
  })

  test('can delete an attendance', async function(assert) {
    await visit('/attendances')

    await click(
      '[data-test-attendance-slider-id="1"] [data-test-delete-attendance]'
    )

    assert.equal(find('[data-test-attendance-slider-id]', 1).length, 0)

    assert.dom('[data-test-attendance-slider]').exists({ count: 1 })
  })
})
