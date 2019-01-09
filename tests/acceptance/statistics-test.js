import {
  click,
  fillIn,
  currentURL,
  visit,
  findAll,
  find
} from '@ember/test-helpers'
import { authenticateSession } from 'ember-simple-auth/test-support'
import { beforeEach, describe, it } from 'mocha'
import { setupApplicationTest } from 'ember-mocha'
import { expect } from 'chai'
import moment from 'moment'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'

describe('Acceptance | statistics', function() {
  let application = setupApplicationTest()
  setupMirage(application)

  beforeEach(async function() {
    let user = this.server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })

    this.server.createList('year-statistic', 5)
    this.server.createList('month-statistic', 5)
    this.server.createList('customer-statistic', 5)
    this.server.createList('project-statistic', 5)
    this.server.createList('task-statistic', 5)
    this.server.createList('user-statistic', 5)
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
    let to = moment().subtract(10, 'days')

    await fillIn(
      '[data-test-filter-from-date] input',
      from.format('DD.MM.YYYY')
    )
    await fillIn('[data-test-filter-to-date] input', to.format('DD.MM.YYYY'))

    expect(currentURL()).to.contain(`fromDate=${from.format('YYYY-MM-DD')}`)
    expect(currentURL()).to.contain(`toDate=${to.format('YYYY-MM-DD')}`)

    await click('.filter-sidebar-reset')

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
    await this.server.createList('billing-type', 3)

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

    expect(await find('[data-test-filter-review] .btn.active')).to.be.ok
    expect(await find('[data-test-filter-not-billable] .btn.active')).to.be.ok
    expect(await find('[data-test-filter-verified] .btn.active')).to.be.ok
  })
})
