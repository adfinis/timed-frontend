import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import { describe, it, beforeEach, afterEach } from 'mocha'
import { expect } from 'chai'
import destroyApp from '../helpers/destroy-app'
import startApp from '../helpers/start-app'
import { findAll, find } from 'ember-native-dom-helpers'
import moment from 'moment'

describe('Acceptance | statistics', function() {
  let application

  beforeEach(async function() {
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

  afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  it('can view statistics by year', async function() {
    await visit('/statistics')

    expect(await findAll('thead > tr > th')).to.have.length(3)
    expect(await findAll('tbody > tr')).to.have.length(5)
    expect(await find('tfoot').innerHTML).to.contain('Total')
  })

  it('can view statistics by month', async function() {
    await visit('/statistics?type=month')

    expect(await findAll('thead > tr > th')).to.have.length(4)
    expect(await findAll('tbody > tr')).to.have.length(5)
    expect(await find('tfoot').innerHTML).to.contain('Total')
  })

  it('can view statistics by customer', async function() {
    await visit('/statistics?type=customer')

    expect(await findAll('thead > tr > th')).to.have.length(3)
    expect(await findAll('tbody > tr')).to.have.length(5)
    expect(await find('tfoot').innerHTML).to.contain('Total')
  })

  it('can view statistics by project', async function() {
    await visit('/statistics?type=project&customer=1')

    expect(await findAll('thead > tr > th')).to.have.length(5)
    expect(await findAll('tbody > tr')).to.have.length(5)
    expect(await find('tfoot').innerHTML).to.contain('Total')
  })

  it('can view statistics by task', async function() {
    await visit('/statistics?type=task&customer=1&project=1')

    expect(await findAll('thead > tr > th')).to.have.length(6)
    expect(await findAll('tbody > tr')).to.have.length(5)
    expect(await find('tfoot').innerHTML).to.contain('Total')
  })

  it('can view statistics by user', async function() {
    await visit('/statistics?type=user')

    expect(await findAll('thead > tr > th')).to.have.length(3)
    expect(await findAll('tbody > tr')).to.have.length(5)
    expect(await find('tfoot').innerHTML).to.contain('Total')
  })

  it('can filter and reset filter', async function() {
    await visit('/statistics')

    let from = moment()
      .subtract(10, 'days')
      .format('YYYY-MM-DD')
    let to = moment().format('YYYY-MM-DD')

    await click('[data-test-filter-from-date] input')
    await click(`[data-date=${from}]`)
    await click('[data-test-filter-to-date] input')
    await click(`[data-date=${to}]`)

    expect(currentURL()).to.contain(`fromDate=${from}`)
    expect(currentURL()).to.contain(`toDate=${to}`)

    await click('[data-test-filter-reset] button')

    expect(currentURL()).to.not.contain(`fromDate=${from}`)
    expect(currentURL()).to.not.contain(`toDate=${to}`)
  })

  it('shows missing parameters message', async function() {
    await visit('/statistics?type=task')

    expect(await find('.empty').innerHTML).to.contain(
      'Customer and project are required parameters'
    )
  })

  it('resets ordering on type change', async function() {
    await visit('/statistics?type=month&ordering=year')

    await click('.nav-tabs li a:first-child')

    expect(currentURL()).to.not.contain('ordering')
  })

  it('can have initial filters', async function() {
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
      notVerified: 0
    }

    await visit(
      `/statistics?${Object.keys(params)
        .map(k => `${k}=${params[k]}`)
        .join('&')}`
    )

    expect(
      await find(
        '[data-test-filter-customer] .ember-power-select-selected-item'
      )
    ).to.be.ok

    expect(
      await find('[data-test-filter-project] .ember-power-select-selected-item')
    ).to.be.ok

    expect(
      await find('[data-test-filter-task] .ember-power-select-selected-item')
    ).to.be.ok

    expect(
      await find('[data-test-filter-user] .ember-power-select-selected-item')
    ).to.be.ok

    expect(
      await find(
        '[data-test-filter-reviewer] .ember-power-select-selected-item'
      )
    ).to.be.ok

    expect(
      await find('[data-test-filter-billing-type] select').options.selectedIndex
    ).to.be.at.least(1)

    expect(await find('[data-test-filter-from-date] input').value).to.be.ok

    expect(await find('[data-test-filter-to-date] input').value).to.be.ok

    expect(
      await find('[data-test-filter-review] select').options.selectedIndex
    ).to.be.at.least(1)

    expect(
      await find('[data-test-filter-not-billable] select').options.selectedIndex
    ).to.be.at.least(1)

    expect(
      await find('[data-test-filter-not-verified] select').options.selectedIndex
    ).to.be.at.least(1)
  })
})
