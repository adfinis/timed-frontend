import {
  click,
  fillIn,
  currentURL,
  visit,
  find,
  findAll
} from '@ember/test-helpers'
import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import destroyApp from '../helpers/destroy-app'
import startApp from '../helpers/start-app'
import { module, test } from 'qunit'

module('Acceptance | analysis', function(hooks) {
  let application

  hooks.beforeEach(async function() {
    application = startApp()

    let user = server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

    server.createList('report', 40, { userId: user.id })
  })

  hooks.afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  test('can visit /analysis', async function(assert) {
    await visit('/analysis')

    assert.dom('.table--analysis tbody tr').exists({ count: 21 })

    await find('.table--analysis tbody tr:last-child').scrollIntoView()
  })

  test('can download a file', async function(assert) {
    await visit('/analysis')

    await click('.export-buttons .btn:first-child')

    assert.dom('[data-download-count="1"]').exists()
  })

  test('can filter and reset filter', async function(assert) {
    await visit('/analysis')

    await userSelect('[data-test-filter-user]')
    await fillIn('[data-test-filter-from-date] input', '01.12.2016')
    await fillIn('[data-test-filter-to-date] input', '01.12.2017')
    await click('thead > tr > th:first-child')

    assert.dom(currentURL()).includesText('user=1')
    assert.dom(currentURL()).includesText('fromDate=2016-12-01')
    assert.dom(currentURL()).includesText('toDate=2017-12-01')
    assert.dom(currentURL()).includesText('ordering=-user__username%2Cid')

    await click('.filter-sidebar-reset')

    // ordering should not be resetted
    assert.equal(currentURL(), '/analysis?ordering=-user__username%2Cid')
  })

  test('can have initial filters', async function(assert) {
    let params = {
      customer: server.create('customer').id,
      project: server.create('project').id,
      task: server.create('task').id,
      user: server.create('user').id,
      reviewer: server.create('user').id,
      billingType: server.create('billing-type').id,
      costCenter: server.create('cost-center').id,
      fromDate: '2016-12-01',
      toDate: '2017-12-01',
      review: '',
      notBillable: '',
      verified: ''
    }

    await visit(
      `/analysis?${Object.keys(params)
        .map(k => `${k}=${params[k]}`)
        .join('&')}`
    )

    assert
      .dom('[data-test-filter-customer] .ember-power-select-selected-item')
      .exists()
    assert
      .dom('[data-test-filter-project] .ember-power-select-selected-item')
      .exists()
    assert
      .dom('[data-test-filter-task] .ember-power-select-selected-item')
      .exists()
    assert
      .dom('[data-test-filter-user] .ember-power-select-selected-item')
      .exists()
    assert
      .dom('[data-test-filter-reviewer] .ember-power-select-selected-item')
      .exists()
    assert.equal(
      find('[data-test-filter-billing-type] select').selectedIndex,
      1
    )
    assert.equal(find('[data-test-filter-cost-center] select').selectedIndex, 1)

    assert.dom('[data-test-filter-from-date] input').hasText('01.12.2016')
    assert.dom('[data-test-filter-to-date] input').hasText('01.12.2017')

    assert.equal(
      findAll('[data-test-filter-review] button').indexOf(
        find('[data-test-filter-review] button.active')
      ),
      0
    )
    assert.equal(
      findAll('[data-test-filter-not-billable] button').indexOf(
        find('[data-test-filter-not-billable] button.active')
      ),
      0
    )
    assert.equal(
      findAll('[data-test-filter-verified] button').indexOf(
        find('[data-test-filter-verified] button.active')
      ),
      0
    )
  })

  test('can select a report', async function(assert) {
    await visit('/analysis')

    await click('tbody > tr:first-child')

    assert.ok(find('tbody > tr:first-child.selected'))

    await click('tbody > tr:first-child')

    assert.notOk(find('tbody > tr:first-child.selected'))
  })

  test('can edit', async function(assert) {
    server.create('report-intersection')

    await visit('/analysis?editable=1')

    await click('[data-test-edit-all]')

    assert.equal(currentURL(), '/analysis/edit?editable=1')
  })

  test('can not edit', async function(assert) {
    server.create('report-intersection')

    await visit('/analysis')

    await click('[data-test-edit-all]')

    assert.equal(currentURL(), '/analysis')
  })

  test('can edit selected reports', async function(assert) {
    server.create('report-intersection')

    await visit('/analysis')

    await click('tbody > tr:nth-child(1)')
    await click('tbody > tr:nth-child(2)')

    await click('[data-test-edit-selected]')

    assert.equal(currentURL(), '/analysis/edit?id=1%2C2')
  })
})
