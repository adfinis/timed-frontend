import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | form booking filter', function() {
  setupComponentTest('form-booking-filter', {
    integration: true
  })

  it('renders', function() {
    this.render(hbs`{{form-booking-filter}}`)
    expect(this.$()).to.have.length(1)
  })
})
