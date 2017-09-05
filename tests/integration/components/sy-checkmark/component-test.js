import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | sy checkmark', function() {
  setupComponentTest('sy-checkmark', {
    integration: true
  })

  it('works unchecked', function() {
    this.render(hbs`{{sy-checkmark checked=false}}`)
    expect(this.$('.fa-square-o')).to.have.length(1)
  })

  it('works checked', function() {
    this.render(hbs`{{sy-checkmark checked=true}}`)
    expect(this.$('.fa-check-square-o')).to.have.length(1)
  })
})
