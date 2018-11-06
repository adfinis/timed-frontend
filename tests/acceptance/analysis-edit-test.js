import { click, find, fillIn, currentURL, visit } from '@ember/test-helpers'
import { authenticateSession } from 'ember-simple-auth/test-support'
import { beforeEach, describe, it } from 'mocha'
import { setupApplicationTest } from 'ember-mocha'
import { expect } from 'chai'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'

describe('Acceptance | analysis edit', function() {
  let application = setupApplicationTest()
  setupMirage(application)

  beforeEach(async function() {
    let user = this.server.create('user')
    this.user = user

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

    this.server.create('report-intersection', { verified: false })
  })

  it('can visit /analysis/edit', async function() {
    await visit('/analysis/edit')

    expect(currentURL()).to.equal('/analysis/edit')
  })

  it('can edit', async function() {
    await visit('/analysis/edit?id=1,2,3')

    let res = {}

    this.server.post('/reports/bulk', (_, { requestBody }) => {
      res = JSON.parse(requestBody)
    })

    await fillIn('[data-test-comment] input', 'test comment 123')
    await click('[data-test-not-billable] input')
    await click('[data-test-review] input')

    await click('.btn-primary')

    let { data: { type, attributes, relationships } } = res

    expect(type).to.equal('report-bulks')

    // only changed attributes were sent
    expect(Object.keys(attributes)).to.deep.equal([
      'comment',
      'not-billable',
      'review'
    ])
    expect(Object.keys(relationships)).to.deep.equal([
      'customer',
      'project',
      'task'
    ])

    expect(currentURL()).to.equal('/analysis')
  })

  it('can cancel', async function() {
    await visit('/analysis/edit')

    await click('[data-test-cancel]')

    expect(currentURL()).to.equal('/analysis')
  })

  it('can reset', async function() {
    await visit('/analysis/edit')

    await fillIn('[data-test-comment] input', 'test')

    expect(find('[data-test-comment] input').value).to.equal('test')

    await click('[data-test-reset]')

    expect(find('[data-test-comment] input').value).to.not.equal('test')
  })

  it('can not verify', async function() {
    await visit('/analysis/edit')

    expect(find('[data-test-verified] input').disabled).to.equal(true)
  })
})
