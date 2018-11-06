import { click, currentURL, visit } from '@ember/test-helpers'
import { authenticateSession } from 'ember-simple-auth/test-support'
import { beforeEach, describe, it } from 'mocha'
import { setupApplicationTest } from 'ember-mocha'
import { expect } from 'chai'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'

describe('Acceptance | index attendances', function() {
  let application = setupApplicationTest()
  setupMirage(application)

  beforeEach(async function() {
    let user = this.server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })

    this.server.create('attendance', 'morning', { userId: user.id })
    this.server.create('attendance', 'afternoon', { userId: user.id })
  })

  it('can visit /attendances', async function() {
    await visit('/attendances')

    expect(currentURL()).to.equal('/attendances')
  })

  it('can list attendances', async function() {
    await visit('/attendances')

    expect(find('[data-test-attendance-slider]')).to.have.length(2)
  })

  it('can save an attendances', async function() {
    await visit('/attendances')

    expect(find('[data-test-attendance-slider]')).to.have.length(2)

    await click('[data-test-attendance-slider-id="1"] .noUi-draggable')

    expect(find('[data-test-attendance-slider]')).to.have.length(2)
  })

  it('can add an attendance', async function() {
    await visit('/attendances')

    await click('[data-test-add-attendance]')

    expect(find('[data-test-attendance-slider]')).to.have.length(3)
  })

  it('can delete an attendance', async function() {
    await visit('/attendances')

    await click(
      '[data-test-attendance-slider-id="1"] [data-test-delete-attendance]'
    )

    expect(find('[data-test-attendance-slider-id]', 1)).to.have.length(0)

    expect(find('[data-test-attendance-slider]')).to.have.length(1)
  })
})
