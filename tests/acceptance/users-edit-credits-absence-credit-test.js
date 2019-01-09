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

describe('Acceptance | users edit credits absence credit', function() {
  let application = setupApplicationTest()
  setupMirage(application)

  beforeEach(async function() {
    this.user = this.server.create('user', { isSuperuser: true })
    this.types = this.server.loadFixtures('absence-types')

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: this.user.id })
  })

  it('can create an absence credit', async function() {
    await visit(`/users/${this.user.id}/credits/absence-credits/new`)

    await click('.btn-group .btn:first-child')
    await fillIn('input[name=date]', moment().format('DD.MM.YYYY'))
    await fillIn('input[name=days]', '5')
    await fillIn('input[name=comment]', 'Comment')

    await click('.btn-primary')

    expect(currentURL()).to.equal(`/users/${this.user.id}/credits`)

    expect(findAll('[data-test-absence-credits] tbody > tr')).to.have.length(1)
  })

  it('can edit an absence credit', async function() {
    let { id } = this.server.create('absence-credit', { user: this.user })

    await visit(`/users/${this.user.id}/credits`)

    await click('[data-test-absence-credits] tbody > tr:first-child')

    expect(currentURL()).to.equal(
      `/users/${this.user.id}/credits/absence-credits/${id}`
    )

    await fillIn('input[name=date]', moment().format('DD.MM.YYYY'))
    await fillIn('input[name=days]', '5')
    await fillIn('input[name=comment]', 'Ding dong')

    await click('.btn-primary')

    expect(currentURL()).to.equal(`/users/${this.user.id}/credits`)

    expect(findAll('[data-test-absence-credits] tbody > tr')).to.have.length(1)

    expect(
      find(
        '[data-test-absence-credits] tbody > tr:first-child > td:nth-child(1)'
      ).innerHTML.trim()
    ).to.equal(moment().format('DD.MM.YYYY'))

    expect(
      find(
        '[data-test-absence-credits] tbody > tr:first-child > td:nth-child(2)'
      ).innerHTML.trim()
    ).to.equal('5')

    expect(
      find(
        '[data-test-absence-credits] tbody > tr:first-child > td:nth-child(4)'
      ).innerHTML.trim()
    ).to.equal('Ding dong')
  })

  it('can delete an absence credit', async function() {
    let { id } = this.server.create('absence-credit', { user: this.user })

    await visit(`/users/${this.user.id}/credits/absence-credits/${id}`)

    await click('.btn-danger')

    expect(currentURL()).to.equal(`/users/${this.user.id}/credits`)

    expect(findAll('[data-test-absence-credits] tr')).to.have.length(0)
  })

  it('redirects to the year of the created absence credit', async function() {
    await visit(`/users/${this.user.id}/credits/absence-credits/new`)

    await click('.btn-group .btn:first-child')
    await fillIn(
      'input[name=date]',
      moment()
        .add(1, 'years')
        .format('DD.MM.YYYY')
    )
    await fillIn('input[name=days]', '5')
    await fillIn('input[name=comment]', 'Comment')

    await click('.btn-primary')

    expect(currentURL()).to.equal(
      `/users/${this.user.id}/credits?year=${moment().year() + 1}`
    )
  })
})
