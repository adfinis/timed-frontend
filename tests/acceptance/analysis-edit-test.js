import { click, fillIn, currentURL, visit } from '@ember/test-helpers'
import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import destroyApp from '../helpers/destroy-app'
import startApp from '../helpers/start-app'
import { module, test } from 'qunit'

module('Acceptance | analysis edit', function(hooks) {
  let application

  hooks.beforeEach(async function() {
    application = startApp()

    let user = server.create('user')
    this.user = user

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

    server.create('report-intersection', { verified: false })
  })

  hooks.afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  test('can visit /analysis/edit', async function(assert) {
    await visit('/analysis/edit')

    assert.equal(currentURL(), '/analysis/edit')
  })

  test('can edit', async function(assert) {
    await visit('/analysis/edit?id=1,2,3')

    let res = {}

    server.post('/reports/bulk', (_, { requestBody }) => {
      res = JSON.parse(requestBody)
    })

    await fillIn('[data-test-comment] input', 'test comment 123')
    await click('[data-test-not-billable] input')
    await click('[data-test-review] input')

    await click('.btn-primary')

    let { data: { type, attributes, relationships } } = res

    assert.equal(type, 'report-bulks')

    // only changed attributes were sent
    assert.deepEqual(Object.keys(attributes), [
      'comment',
      'not-billable',
      'review'
    ])
    assert.deepEqual(Object.keys(relationships), [
      'customer',
      'project',
      'task'
    ])

    assert.equal(currentURL(), '/analysis')
  })

  test('can cancel', async function(assert) {
    await visit('/analysis/edit')

    await click('[data-test-cancel]')

    assert.equal(currentURL(), '/analysis')
  })

  test('can reset', async function(assert) {
    await visit('/analysis/edit')

    await fillIn('[data-test-comment] input', 'test')

    assert.dom('[data-test-comment] input').hasText('test')

    await click('[data-test-reset]')

    assert.dom('[data-test-comment] input').doesNotIncludeText('test')
  })

  test('can not verify', async function(assert) {
    await visit('/analysis/edit')

    assert.dom('[data-test-verified] input').isDisabled()
  })
})
