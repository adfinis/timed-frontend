import {
  click,
  fillIn,
  find,
  findAll,
  currentURL,
  visit,
  triggerEvent
} from '@ember/test-helpers'
import { authenticateSession } from 'ember-simple-auth/test-support'
import { beforeEach, describe, it } from 'mocha'
import { setupApplicationTest } from 'ember-mocha'
import { expect } from 'chai'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'
import taskSelect from 'timed/tests/helpers/task-select'

describe('Acceptance | index activities edit', function() {
  let application = setupApplicationTest()
  setupMirage(application)

  beforeEach(async function() {
    let user = this.server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })

    this.server.createList('activity', 5, { userId: user.id })

    this.user = user
  })

  it('can edit an activity', async function() {
    await visit('/')

    await click('[data-test-activity-row-id="1"]')

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

    await click('[data-test-save]')

    expect(currentURL()).to.equal('/')

    expect(find('[data-test-activity-row-id="1"]').innerText).to.include('Test')
  })

  it('can delete an activity', async function() {
    await visit('/')

    await click('[data-test-activity-row-id="1"]')

    expect(currentURL()).to.equal('/edit/1')

    await click('[data-test-delete]')

    expect(currentURL()).to.equal('/')

    expect(findAll('[data-test-activity-row-id="1"]')).to.have.length(0)
    expect(findAll('[data-test-activity-row]')).to.have.length(4)
  })

  it("can't delete an active activity", async function() {
    let { id } = this.server.create('activity', 'active', {
      userId: this.user.id
    })

    await visit(`/edit/${id}`)

    await click('[data-test-delete]')

    expect(find('[data-test-delete]').hasAttribute('disabled')).to.be.ok
    expect(findAll(`[data-test-activity-row-id="${id}"]`)).to.have.length(1)
  })

  it('closes edit window when clicking on the currently edited activity row', async function() {
    await visit('/')

    await click('[data-test-activity-row-id="1"]')

    expect(currentURL()).to.equal('/edit/1')

    await click('[data-test-activity-row-id="2"]')

    expect(currentURL()).to.equal('/edit/2')

    await click('[data-test-activity-row-id="2"]')

    expect(currentURL()).to.equal('/')
  })

  it('validates time on blur', async function() {
    let { id } = this.server.create('activity', { userId: this.user.id })

    await visit(`/edit/${id}`)

    await fillIn(
      '[data-test-activity-block-row] td:nth-child(1) input',
      '02:30'
    )
    await fillIn(
      '[data-test-activity-block-row] td:nth-child(3) input',
      '01:30'
    )
    await triggerEvent(
      '[data-test-activity-block-row] td:nth-child(3) input',
      'blur'
    )

    expect(
      find('[data-test-activity-block-row] td:nth-child(3)').classList.contains(
        'has-error'
      )
    ).to.be.ok

    await fillIn(
      '[data-test-activity-block-row] td:nth-child(1) input',
      '00:30'
    )
    await triggerEvent(
      '[data-test-activity-block-row] td:nth-child(1) input',
      'blur'
    )

    expect(
      find('[data-test-activity-block-row] td:nth-child(3)').classList.contains(
        'has-error'
      )
    ).to.not.be.ok
  })

  it('can not edit transferred activities', async function() {
    let { id } = this.server.create('activity', {
      userId: this.user.id,
      transferred: true
    })
    await visit(`/edit/${id}`)
    expect(currentURL()).to.equal('/')
  })
})
