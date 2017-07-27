import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | sy modal/body', function() {
  setupComponentTest('sy-modal/body', {
    integration: true
  })

  it('renders', function() {
    this.render(hbs`{{#sy-modal/body}}Test{{/sy-modal/body}}`)

    expect(this.$().text().trim()).to.equal('Test')
  })
})
