import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | worktime balance chart', function() {
  setupComponentTest('worktime-balance-chart', {
    integration: true
  })

  it('renders', function() {
    this.render(hbs`{{worktime-balance-chart}}`)
    expect(this.$()).to.have.length(1)
  })
})
