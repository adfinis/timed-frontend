import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import { describe, it, beforeEach, afterEach } from 'mocha'
import destroyApp from '../helpers/destroy-app'
import { expect } from 'chai'
import startApp from '../helpers/start-app'

describe('Acceptance | analysis', function() {
  let application

  beforeEach(async function() {
    application = startApp()

    let user = server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

    server.createList('report', 6)
  })

  afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  it("can't visit /analysis on mobile", async function() {
    setBreakpoint('mo')

    await visit('/analysis')

    expect(currentURL()).to.equal('/')
  })

  it('can visit /analysis', async function() {
    await visit('/analysis')

    expect(currentURL()).to.equal('/analysis')
  })

  it('can search and download file', async function() {
    await visit('/analysis')
    await userSelect('[data-test-filter-user]')
    await click('[data-test-filter-apply]')

    expect(find('[data-test-filter-results] tbody tr').length).to.equal(6)

    await click('[data-test-download-file="0"]')
    expect(currentURL()).to.equal('/analysis?user=1')
  })

  it('can reset the search params', async function() {
    await visit('/analysis')

    await userSelect()
    await taskSelect()

    await click('[data-test-filter-apply]')

    expect(currentURL()).to.contain('customer')
    expect(currentURL()).to.contain('project')
    expect(currentURL()).to.contain('task')
    expect(currentURL()).to.contain('user')

    await click('[data-test-filter-reset]')

    expect(currentURL()).to.equal('/analysis')
  })

  it('shows a total', async function() {
    await visit('/analysis?customer=1')

    expect(
      find('tfoot tr:first-child td:nth-child(2)')
        .text()
        .trim()
    ).to.match(/\d{2}:\d{2}/)
  })
})
