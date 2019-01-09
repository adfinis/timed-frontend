import {
  click,
  fillIn,
  currentURL,
  visit,
  findAll,
  find
} from '@ember/test-helpers'
import { authenticateSession } from 'ember-simple-auth/test-support'
import { beforeEach, describe, it } from 'mocha'
import { setupApplicationTest } from 'ember-mocha'
import { expect } from 'chai'
import moment from 'moment'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'

describe('Acceptance | users edit credits overtime credit', function() {
  let application = setupApplicationTest()
  setupMirage(application)

  beforeEach(async function() {
    this.user = this.server.create('user', { isSuperuser: true })

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: this.user.id })
  })

  it('can create an overtime credit', async function() {
    await visit(`/users/${this.user.id}/credits/overtime-credits/new`)

    await fillIn('input[name=date]', moment().format('DD.MM.YYYY'))
    await fillIn('input[name=duration]', '20:00')
    await fillIn('input[name=comment]', 'Comment')

    await click('.btn-primary')

    expect(currentURL()).to.equal(`/users/${this.user.id}/credits`)

    expect(findAll('[data-test-overtime-credits] tbody > tr')).to.have.length(1)
  })

  it('can edit an overtime credit', async function() {
    let { id } = this.server.create('overtime-credit', { user: this.user })

    await visit(`/users/${this.user.id}/credits`)

    await click('[data-test-overtime-credits] tbody > tr:first-child')

    expect(currentURL()).to.equal(
      `/users/${this.user.id}/credits/overtime-credits/${id}`
    )

    await fillIn('input[name=date]', moment().format('DD.MM.YYYY'))
    await fillIn('input[name=duration]', '20:00')
    await fillIn('input[name=comment]', 'Ding dong')

    await click('.btn-primary')

    expect(currentURL()).to.equal(`/users/${this.user.id}/credits`)

    expect(findAll('[data-test-overtime-credits] tbody > tr')).to.have.length(1)

    expect(
      find(
        '[data-test-overtime-credits] tbody > tr:first-child > td:nth-child(1)'
      ).innerHTML.trim()
    ).to.equal(moment().format('DD.MM.YYYY'))

    expect(
      find(
        '[data-test-overtime-credits] tbody > tr:first-child > td:nth-child(2)'
      ).innerHTML.trim()
    ).to.equal('20h 0m')

    expect(
      find(
        '[data-test-overtime-credits] tbody > tr:first-child > td:nth-child(3)'
      ).innerHTML.trim()
    ).to.equal('Ding dong')
  })

  it('can delete an overtime credit', async function() {
    let { id } = this.server.create('overtime-credit', { user: this.user })

    await visit(`/users/${this.user.id}/credits/overtime-credits/${id}`)

    await click('.btn-danger')

    expect(currentURL()).to.equal(`/users/${this.user.id}/credits`)

    expect(findAll('[data-test-overtime-credits] tr')).to.have.length(0)
  })

  it('redirects to the year of the created overtime credit', async function() {
    await visit(`/users/${this.user.id}/credits/overtime-credits/new`)

    await fillIn(
      'input[name=date]',
      moment()
        .add(1, 'years')
        .format('DD.MM.YYYY')
    )
    await fillIn('input[name=duration]', '20:00')
    await fillIn('input[name=comment]', 'Ding dong')

    await click('.btn-primary')

    expect(currentURL()).to.equal(
      `/users/${this.user.id}/credits?year=${moment().year() + 1}`
    )
  })
})
