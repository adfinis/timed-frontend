import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import { findAll } from 'ember-native-dom-helpers'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | loading icon', function() {
  setupComponentTest('loading-icon', {
    integration: true
  })

  it('renders', function() {
    this.render(hbs`{{loading-icon}}`)

    expect(findAll('.loading-dot')).to.have.length(9)
  })
})
