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

describe('Acceptance | users edit credits', function() {
  let application = setupApplicationTest()
  setupMirage(application)

  beforeEach(async function() {
    this.user = this.server.create('user', { isSuperuser: true })

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: this.user.id })
  })

  it('can visit /users/:id/credits', async function() {
    await visit(`/users/1/credits`)

    expect(findAll('.card')).to.have.length(2)
  })

  it('can change year', async function() {
    let { employments: { models: [activeEmployment] } } = this.user

    await visit(`/users/1/credits`)

    expect(find('select option:first-child').innerHTML.trim()).to.equal(
      activeEmployment.start.getFullYear().toString()
    )

    expect(find('select option:nth-last-child(2)').innerHTML.trim()).to.equal(
      moment()
        .add(1, 'year')
        .year()
        .toString()
    )

    expect(find('select option:last-child').innerHTML.trim()).to.equal('All')

    await fillIn(
      'select',
      moment()
        .add(1, 'year')
        .year()
    )

    expect(currentURL()).to.contain(
      `year=${moment()
        .add(1, 'year')
        .year()}`
    )
  })

  it('can transfer', async function() {
    await visit(`/users/1/credits?year=${moment().year() - 1}`)

    await click('.year-select .btn')

    expect(currentURL()).to.equal('/users/1/credits')
  })
})
