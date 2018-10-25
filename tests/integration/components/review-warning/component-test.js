import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | review warning', function() {
  setupComponentTest('review-warning', {
    integration: true
  })

  it('renders', function() {

    this.render(hbs`{{review-warning}}`)
    expect(this.$()).to.have.length(1)
  })
})
