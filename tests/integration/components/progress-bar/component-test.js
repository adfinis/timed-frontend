import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | progress bar', function() {
  setupComponentTest('progress-bar', {
    integration: true
  })

  it('renders', function() {
    this.render(hbs`{{progress-bar 0.5}}`)

    expect(parseInt(this.$('progress').attr('value'))).to.equal(50)
  })
})
