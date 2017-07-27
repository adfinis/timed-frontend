import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | sy modal target', function() {
  setupComponentTest('sy-modal-target', {
    integration: true
  })

  it('renders', function() {
    this.render(hbs`{{sy-modal-target}}`)
    expect(this.$('#sy-modals')).to.have.length(1)
  })
})
