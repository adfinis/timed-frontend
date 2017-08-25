import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | welcome modal', function() {
  setupComponentTest('welcome-modal', {
    integration: true
  })

  it('renders', function() {
    this.render(hbs`{{sy-modal-target}}{{welcome-modal visible=true}}`)
    expect(this.$()).to.have.length(1)
  })
})
