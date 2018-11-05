import { find } from '@ember/test-helpers'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | sy modal/footer', function() {
  setupComponentTest('sy-modal/footer', {
    integration: true
  })

  it('renders', function() {
    this.render(hbs`{{#sy-modal/footer}}Test{{/sy-modal/footer}}`)

    expect(find('*').textContent.trim()).to.equal('Test')
  })
})
