import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | sy durationpicker day', function() {
  setupComponentTest('sy-durationpicker-day', {
    integration: true
  })

  it('renders', function() {
    this.render(hbs`{{sy-durationpicker-day}}`)
    expect(this.$()).to.have.length(1)
  })
})
