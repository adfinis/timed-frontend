import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'
import { click, find } from 'ember-native-dom-helpers'
import wait from 'ember-test-helpers/wait'

describe('Integration | Component | filter sidebar', function() {
  setupRenderingTest()

  it('can reset', async function() {
    this.set('didReset', false)

    await render(hbs`
      <div id="filter-sidebar-target"></div>
      {{filter-sidebar on-reset=(action (mut didReset) true)}}
    `)

    return wait().then(() => {
      click('.filter-sidebar-reset')

      expect(this.get('didReset')).to.be.true
    })
  })

  it('shows applied filter count', async function() {
    this.set('count', 0)

    await render(hbs`
      <div id="filter-sidebar-target"></div>
      {{filter-sidebar appliedCount=count}}
    `)

    return wait().then(() => {
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
})
