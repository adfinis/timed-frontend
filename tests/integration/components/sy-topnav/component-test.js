import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | sy topnav', function() {
  setupComponentTest('sy-topnav', {
    integration: true
  })

  it('renders', function() {
    this.render(hbs`{{sy-topnav}}`)
    expect(this.$()).to.have.length(1)
  })
})
