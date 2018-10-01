import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import { describe, it, beforeEach, afterEach } from 'mocha'
import destroyApp from '../helpers/destroy-app'
import { expect } from 'chai'
import startApp from '../helpers/start-app'

describe('Acceptance | index activities edit', function() {
  let application

  beforeEach(async function() {
    application = startApp()

    let user = server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

    server.createList('activity', 5, { userId: user.id })

    this.user = user
  })

  afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  it('can edit an activity', async function() {
    await visit('/')

    await click(find('[data-test-activity-row-id="1"]'))

    expect(currentURL()).to.equal('/edit/1')

    await taskSelect('[data-test-activity-edit-form]')

    await fillIn(
      '[data-test-activity-edit-form] [data-test-activity-block-row] td:nth-child(1) input',
      '03:30'
    )
    await fillIn(
      '[data-test-activity-edit-form] [data-test-activity-block-row] td:nth-child(3) input',
      '04:30'
    )

    await fillIn('[data-test-activity-edit-form] input[name=comment]', 'Test')

    await click(find('button:contains(Save)'))

    expect(currentURL()).to.equal('/')

    expect(find('[data-test-activity-row-id="1"]').text()).to.include('Test')
  })

  it('can delete an activity', async function() {
    await visit('/')

    await click(find('[data-test-activity-row-id="1"]'))

    expect(currentURL()).to.equal('/edit/1')

    await click(find('button:contains(Delete)'))

    expect(currentURL()).to.equal('/')

    expect(find('[data-test-activity-row-id="1"]')).to.have.length(0)
    expect(find('[data-test-activity-row]')).to.have.length(4)
  })

  it("can't delete an active activity", async function() {
    let { id } = server.create('activity', 'active', { userId: this.user.id })

    await visit(`/edit/${id}`)

    await click(find('button:contains(Delete)'))

    expect(find('button:contains(Delete)').is(':disabled')).to.be.ok
    expect(find(`[data-test-activity-row-id="${id}"]`)).to.have.length(1)
  })

  it('closes edit window when clicking on the currently edited activity row', async function() {
    await visit('/')

    await click(find('[data-test-activity-row-id="1"]'))

    expect(currentURL()).to.equal('/edit/1')

    await click(find('[data-test-activity-row-id="2"]'))

    expect(currentURL()).to.equal('/edit/2')

    await click(find('[data-test-activity-row-id="2"]'))

    expect(currentURL()).to.equal('/')
  })

  it('validates time on blur', async function() {
    let { id } = server.create('activity', { userId: this.user.id })

    await visit(`/edit/${id}`)

    await fillIn(
      '[data-test-activity-block-row] td:nth-child(1) input',
      '09:30'
    )
    await fillIn(
      '[data-test-activity-block-row] td:nth-child(3) input',
      '08:30'
    )
    await triggerEvent(
      '[data-test-activity-block-row] td:nth-child(3) input',
      'blur'
    )

    expect(
      find('[data-test-activity-block-row] td:nth-child(3)').hasClass(
        'has-error'
      )
    ).to.be.ok

    await fillIn(
      '[data-test-activity-block-row] td:nth-child(1) input',
      '07:30'
    )
    await triggerEvent(
      '[data-test-activity-block-row] td:nth-child(1) input',
      'blur'
    )

    expect(
      find('[data-test-activity-block-row] td:nth-child(3)').hasClass(
        'has-error'
      )
    ).to.not.be.ok
  })

  it('can not edit transferred activities', async function() {
    let { id } = server.create('activity', {
      userId: this.user.id,
      transferred: true
    })

    await visit(`/edit/${id}`)

    expect(currentURL()).to.equal('/')
  })
})
