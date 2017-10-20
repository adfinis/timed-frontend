import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import { find } from 'ember-native-dom-helpers'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | statistic list/column', function() {
  setupComponentTest('statistic-list/column', {
    integration: true
  })

  it('renders', function() {
    this.render(hbs`{{statistic-list/column}}`)
    expect(find('td')).to.be.ok
  })
})
