import {
  click,
  find,
  findAll,
  fillIn,
  currentURL,
  visit
} from '@ember/test-helpers'
import { authenticateSession } from 'ember-simple-auth/test-support'
import { beforeEach, describe, it } from 'mocha'
import { setupApplicationTest } from 'ember-mocha'
import { expect } from 'chai'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'
import userSelect from 'timed/tests/helpers/user-select'

describe('Acceptance | analysis', function() {
  let application = setupApplicationTest()
  setupMirage(application)

  beforeEach(async function() {
    let user = this.server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })

    this.server.createList('report', 40, { userId: user.id })
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
    expect(currentURL()).to.contain('ordering=-user__username%2Cid')

    await click('.filter-sidebar-reset')

    // ordering should not be resetted
    expect(currentURL()).to.equal('/analysis?ordering=-user__username%2Cid')
  })

  it('can have initial filters', async function() {
    let params = {
      customer: this.server.create('customer').id,
      project: this.server.create('project').id,
      task: this.server.create('task').id,
      user: this.server.create('user').id,
      reviewer: this.server.create('user').id,
      billingType: this.server.create('billing-type').id,
      costCenter: this.server.create('cost-center').id,
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

  it('can select a report', async function() {
    await visit('/analysis')

    await click('tbody > tr:first-child')

    expect(find('tbody > tr:first-child.selected')).to.be.ok

    await click('tbody > tr:first-child')

    expect(find('tbody > tr:first-child.selected')).to.not.be.ok
  })

  it('can edit', async function() {
    this.server.create('report-intersection')

    await visit('/analysis?editable=1')

    await click('[data-test-edit-all]')

    expect(currentURL()).to.equal('/analysis/edit?editable=1')
  })

  it('can not edit', async function() {
    this.server.create('report-intersection')

    await visit('/analysis')

    await click('[data-test-edit-all]')

    expect(currentURL()).to.equal('/analysis')
  })

  it('can edit selected reports', async function() {
    this.server.create('report-intersection')

    await visit('/analysis')

    await click('tbody > tr:nth-child(1)')
    await click('tbody > tr:nth-child(2)')

    await click('[data-test-edit-selected]')

    expect(currentURL()).to.equal('/analysis/edit?id=1%2C2')
  })
})
