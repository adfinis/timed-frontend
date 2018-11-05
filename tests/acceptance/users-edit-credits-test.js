import { click, fillIn, currentURL, visit } from '@ember/test-helpers'
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

describe('Acceptance | users edit credits', function() {
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
