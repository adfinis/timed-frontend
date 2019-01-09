import { click, fillIn, currentURL, visit, findAll } from '@ember/test-helpers'
import { authenticateSession } from 'ember-simple-auth/test-support'
import { beforeEach, describe, it } from 'mocha'
import { setupApplicationTest } from 'ember-mocha'
import { expect } from 'chai'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'
import userSelect from 'timed/tests/helpers/user-select'
import { selectSearch } from 'ember-power-select/test-support'

describe('Acceptance | users', function() {
  let application = setupApplicationTest()
  setupMirage(application)

  beforeEach(async function() {
    let user = this.server.create('user')

    this.server.createList('user', 5, { supervisorIds: [user.id] })
    this.server.createList('user', 5)

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })
  })

  it('shows only supervisees', async function() {
    await visit('/users')

    // 5 supervisees and the user himself
    expect(findAll('table tr')).to.have.length(6)
  })

  it('shows all to superuser', async function() {
    let user = this.server.create('user', { isSuperuser: true })

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })

    await visit('/users')

    // 12 users and the user himself
    expect(findAll('table tr')).to.have.length(13)
  })

  it('can filter and reset', async function() {
    let user = this.server.create('user', { isSuperuser: true })

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })

    await visit('/users')

    await click('[data-test-filter-active] button:nth-child(1)')
    await fillIn('[data-test-filter-search] input', 'foobar')
    await selectSearch('[data-test-filter-user] .user-select', user.username)
    await userSelect()

    expect(currentURL()).to.contain('search=foobar')
    expect(currentURL()).to.contain('active=')
    expect(currentURL()).to.contain('supervisor=12')

    await click('.filter-sidebar-reset')

    expect(currentURL()).to.equal('/users')
  })
})
