import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import { click, find } from 'ember-native-dom-helpers'

describe('Integration | Component | filter sidebar', function() {
  setupComponentTest('filter-sidebar', {
    integration: true
  })

  it('can reset', function() {
    this.set('didReset', false)

    this.render(hbs`{{filter-sidebar on-reset=(action (mut didReset) true)}}`)

    click('.filter-sidebar-reset')

    expect(this.get('didReset')).to.be.true
  })

  it('shows applied filter count', function() {
    this.set('count', 0)

    this.render(hbs`{{filter-sidebar appliedCount=count}}`)

    expect(find('.filter-sidebar-title').innerHTML).to.contain('Filters')

    this.set('count', 1)

    expect(find('.filter-sidebar-title').innerHTML).to.contain(
      '1 Filter applied'
    )

    this.set('count', 5)

    expect(find('.filter-sidebar-title').innerHTML).to.contain(
      '5 Filters applied'
    )
  })
})
