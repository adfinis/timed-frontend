import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import { find } from 'ember-native-dom-helpers'

describe('Integration | Component | not identical warning', function() {
  setupComponentTest('not-identical-warning', {
    integration: true
  })

  it('renders', function() {
    this.render(hbs`{{not-identical-warning}}`)

    expect(find('i.fa.fa-info-circle')).to.be.ok
  })
})
