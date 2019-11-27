import { click, fillIn, currentURL, visit, find } from '@ember/test-helpers'
import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import destroyApp from '../helpers/destroy-app'
import startApp from '../helpers/start-app'
import moment from 'moment'
import { module, test } from 'qunit'

module('Acceptance | statistics', function(hooks) {
  let application

  hooks.beforeEach(async function() {
    application = startApp()

    let user = server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

    server.createList('year-statistic', 5)
    server.createList('month-statistic', 5)
    server.createList('customer-statistic', 5)
    server.createList('project-statistic', 5)
    server.createList('task-statistic', 5)
    server.createList('user-statistic', 5)
  })

  hooks.afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  test('can view statistics by year', async function(assert) {
    await visit('/statistics')

    assert.dom('thead > tr > th').exists({ count: 3 })
    assert.dom('tbody > tr').exists({ count: 5 })
    assert.dom('tfoot').includesText('Total')
  })

  test('can view statistics by month', async function(assert) {
    await visit('/statistics?type=month')

    assert.dom('thead > tr > th').exists({ count: 4 })
    assert.dom('tbody > tr').exists({ count: 5 })
    assert.dom('tfoot').includesText('Total')
  })

  test('can view statistics by customer', async function(assert) {
    await visit('/statistics?type=customer')

    assert.dom('thead > tr > th').exists({ count: 3 })
    assert.dom('tbody > tr').exists({ count: 5 })
    assert.dom('tfoot').includesText('Total')
  })

  test('can view statistics by project', async function(assert) {
    await visit('/statistics?type=project&customer=1')

    assert.dom('thead > tr > th').exists({ count: 5 })
    assert.dom('tbody > tr').exists({ count: 5 })
    assert.dom('tfoot').includesText('Total')
  })

  test('can view statistics by task', async function(assert) {
    await visit('/statistics?type=task&customer=1&project=1')

    assert.dom('thead > tr > th').exists({ count: 6 })
    assert.dom('tbody > tr').exists({ count: 5 })
    assert.dom('tfoot').includesText('Total')
  })

  test('can view statistics by user', async function(assert) {
    await visit('/statistics?type=user')

    assert.dom('thead > tr > th').exists({ count: 3 })
    assert.dom('tbody > tr').exists({ count: 5 })
    assert.dom('tfoot').includesText('Total')
  })

  test('can filter and reset filter', async function(assert) {
    await visit('/statistics')

    let from = moment()
    let to = moment().subtract(10, 'days')

    await fillIn(
      '[data-test-filter-from-date] input',
      from.format('DD.MM.YYYY')
    )
    await fillIn('[data-test-filter-to-date] input', to.format('DD.MM.YYYY'))

    assert
      .dom(currentURL())
      .includesText(`fromDate=${from.format('YYYY-MM-DD')}`)
    assert.dom(currentURL()).includesText(`toDate=${to.format('YYYY-MM-DD')}`)

    await click('.filter-sidebar-reset')

    assert.dom(currentURL()).doesNotIncludeText(`fromDate=${from}`)
    assert.dom(currentURL()).doesNotIncludeText(`toDate=${to}`)
  })

  test('shows missing parameters message', async function(assert) {
    await visit('/statistics?type=task')

    assert
      .dom('.empty')
      .includesText('Customer and project are required parameters')
  })

  test('resets ordering on type change', async function(assert) {
    await visit('/statistics?type=month&ordering=year')

    await click('.nav-tabs li a:first-child')

    assert
      .dom(currentURL())
      .doesNotIncludeText('Customer and project are required parameters')
  })

  test('can have initial filters', async function(assert) {
    await server.createList('billing-type', 3)

    let params = {
      customer: 1,
      project: 1,
      task: 1,
      user: 1,
      reviewer: 1,
      billingType: 1,
      fromDate: moment()
        .subtract(10, 'days')
        .format('YYYY-MM-DD'),
      toDate: moment().format('YYYY-MM-DD'),
      review: 1,
      notBillable: 0,
      verified: 0
    }

    await visit(
      `/statistics?${Object.keys(params)
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
      find('[data-test-filter-billing-type] select').options.selectedIndex,
      1
    )

    assert.dom('[data-test-filter-from-date] input').exists()

    assert.dom('[data-test-filter-to-date] input').exists()

    assert.dom('[data-test-filter-review] .btn.active').exists()
    assert.dom('[data-test-filter-not-billable] .btn.active').exists()
    assert.dom('[data-test-filter-verified] .btn.active').exists()
  })
})
