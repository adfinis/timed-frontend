import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import { find } from 'ember-native-dom-helpers'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | statistic list/bar', function() {
  setupComponentTest('statistic-list/bar', {
    integration: true
  })

  it('renders', function() {
    this.render(hbs`{{statistic-list/bar 0.5}}`)

    let el = find('.statistic-list-bar')

    expect(el).to.be.ok

    expect(
      window
        .getComputedStyle(el)
        .getPropertyValue('--value')
        .trim()
    ).to.equal('0.5')
  })
})
