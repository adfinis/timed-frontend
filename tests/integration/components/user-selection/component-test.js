import { find, render } from '@ember/test-helpers'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'
import EmberObject from '@ember/object'

const USER = EmberObject.create({
  id: 1,
  firstName: 'Hans',
  lastName: 'Muster',
  username: 'hansm',
  longName: 'Hans Muster (hansm)'
})

describe('Integration | Component | user selection', function() {
  let app = setupRenderingTest()
  setupMirage(app)

  it('renders', async function() {
    this.set('user', USER)

    await render(hbs`
      {{#user-selection user=user on-change=(action (mut user)) as |u|}}
        {{u.user}}
      {{/user-selection}}
    `)

    expect(
      find('.user-select .ember-power-select-selected-item').textContent.trim()
    ).to.equal(USER.longName)
  })
})
