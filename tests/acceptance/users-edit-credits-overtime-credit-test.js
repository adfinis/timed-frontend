import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import { describe, it, beforeEach, afterEach } from 'mocha'
import destroyApp from '../helpers/destroy-app'
import { expect } from 'chai'
import startApp from '../helpers/start-app'
import { findAll, find } from 'ember-native-dom-helpers'
import moment from 'moment'

describe('Acceptance | users edit credits overtime credit', function() {
  let application

  beforeEach(async function() {
    application = startApp()

    this.user = server.create('user', { isSuperuser: true })

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: this.user.id })
  })

  afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  it('can create an overtime credit', async function() {
    await visit(`/users/${this.user.id}/credits/overtime-credits/new`)

    await fillIn('input[name=date]', moment().format('DD.MM.YYYY'))
    await fillIn('input[name=duration]', '20:00')
    await fillIn('input[name=comment]', 'Comment')

    await click('.btn-primary')

    expect(currentURL()).to.equal(`/users/${this.user.id}/credits`)

    expect(findAll('[data-test-overtime-credits] tr')).to.have.length(1)
  })

  it('can edit an overtime credit', async function() {
    let { id } = server.create('overtime-credit')

    await visit(`/users/${this.user.id}/credits/overtime-credits/${id}`)

    await fillIn('input[name=date]', moment().format('DD.MM.YYYY'))
    await fillIn('input[name=duration]', '20:00')
    await fillIn('input[name=comment]', 'Some test comment')

    await click('.btn-primary')

    expect(currentURL()).to.equal(`/users/${this.user.id}/credits`)

    expect(findAll('[data-test-overtime-credits] tr')).to.have.length(1)

    expect(
      find(
        '[data-test-overtime-credits] tr:first-child tr:nth-child(2)'
      ).innerHTML.trim()
    ).to.equal('Some test comment')
  })

  it('can delete an overtime credit', async function() {
    let { id } = server.create('overtime-credit')

    await visit(`/users/${this.user.id}/credits/overtime-credits/${id}`)

    await click('.btn-danger')

    expect(currentURL()).to.equal(`/users/${this.user.id}/credits`)

    expect(findAll('[data-test-overtime-credits] tr')).to.have.length(0)
  })

  /*
  it("can't manage overtime credits without permission", async function() {
    let otherUser = server.create('user', { isSuperuser: true })

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: otherUser.id })

    await visit(`/users/${otherUser.id}/credits`)
  })
  */
})
