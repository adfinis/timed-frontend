import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import { describe, it, beforeEach, afterEach } from 'mocha'
import { expect } from 'chai'
import destroyApp from '../helpers/destroy-app'
import startApp from '../helpers/start-app'
import { findAll, find, click } from 'ember-native-dom-helpers'

describe('Acceptance | analysis', function() {
  let application

  beforeEach(async function() {
    application = startApp()

    let user = server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

    server.createList('report', 40, { userId: user.id })
  })

  afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  it('can visit /analysis', async function() {
    await visit('/analysis')

    expect(findAll('.table--analysis tbody tr')).to.have.length(21)

    await find('.table--analysis tbody tr:last-child').scrollIntoView()
  })

  it('can download a file', async function() {
    await visit('/analysis')

    await click('.export-buttons .btn:first-child')

    expect(find('[data-download-count="1"]')).to.be.ok
  })

  it('can filter and reset filter', async function() {
    await visit('/analysis')

    await userSelect('[data-test-filter-user]')
    await fillIn('[data-test-filter-from-date] input', '01.12.2016')
    await fillIn('[data-test-filter-to-date] input', '01.12.2017')
    await click('thead > tr > th:first-child')

    expect(currentURL()).to.contain('user=1')
    expect(currentURL()).to.contain('fromDate=2016-12-01')
    expect(currentURL()).to.contain('toDate=2017-12-01')
    expect(currentURL()).to.contain('ordering=-user__username')

    await click('.filter-sidebar-reset')

    // ordering should not be resetted
    expect(currentURL()).to.equal('/analysis?ordering=-user__username')
  })

  it('can have initial filters', async function() {
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

    expect(
      find('[data-test-filter-customer] .ember-power-select-selected-item')
    ).to.be.ok
    expect(find('[data-test-filter-project] .ember-power-select-selected-item'))
      .to.be.ok
    expect(find('[data-test-filter-task] .ember-power-select-selected-item')).to
      .be.ok
    expect(find('[data-test-filter-user] .ember-power-select-selected-item')).to
      .be.ok
    expect(
      find('[data-test-filter-reviewer] .ember-power-select-selected-item')
    ).to.be.ok

    expect(
      find('[data-test-filter-billing-type] select').selectedIndex
    ).to.be.at.least(1)
    expect(
      find('[data-test-filter-cost-center] select').selectedIndex
    ).to.be.at.least(1)

    expect(find('[data-test-filter-from-date] input').value).to.equal(
      '01.12.2016'
    )
    expect(find('[data-test-filter-to-date] input').value).to.equal(
      '01.12.2017'
    )

    expect(
      findAll('[data-test-filter-review] button').indexOf(
        find('[data-test-filter-review] button.active')
      )
    ).to.equal(0)
    expect(
      findAll('[data-test-filter-not-billable] button').indexOf(
        find('[data-test-filter-not-billable] button.active')
      )
    ).to.equal(0)
    expect(
      findAll('[data-test-filter-verified] button').indexOf(
        find('[data-test-filter-verified] button.active')
      )
    ).to.equal(0)
  })
})
