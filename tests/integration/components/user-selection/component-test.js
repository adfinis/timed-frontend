import { find } from '@ember/test-helpers'
import { expect } from 'chai'
import { describe, it, beforeEach, afterEach } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import { startMirage } from 'timed/initializers/ember-cli-mirage'
import wait from 'ember-test-helpers/wait'
import EmberObject from '@ember/object'

const USER = EmberObject.create({
  id: 1,
  firstName: 'Hans',
  lastName: 'Muster',
  username: 'hansm',
  longName: 'Hans Muster (hansm)'
})

describe('Integration | Component | user selection', function() {
  setupComponentTest('user-selection', {
    integration: true
  })

  beforeEach(function() {
    this.server = startMirage()
  })

  afterEach(function() {
    this.server.shutdown()
  })

  it('renders', function() {
    this.set('user', USER)

    this.render(hbs`
      {{#user-selection user=user on-change=(action (mut user)) as |u|}}
        {{u.user}}
      {{/user-selection}}
    `)

    return wait().then(() => {
      expect(
        find(
          '.user-select .ember-power-select-selected-item'
        ).textContent.trim()
      ).to.equal(USER.longName)
    })
  })
})
