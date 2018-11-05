import { click, currentURL, visit } from '@ember/test-helpers'
import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import { describe, it, beforeEach, afterEach } from 'mocha'
import destroyApp from '../helpers/destroy-app'
import { expect } from 'chai'
import startApp from '../helpers/start-app'

describe('Acceptance | index attendances', function() {
  let application

  beforeEach(async function() {
    application = startApp()

    let user = server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

    server.create('attendance', 'morning', { userId: user.id })
    server.create('attendance', 'afternoon', { userId: user.id })
  })

  afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
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
