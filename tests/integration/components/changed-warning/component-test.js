import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import { find } from 'ember-native-dom-helpers'

describe('Integration | Component | changed warning', function() {
  setupComponentTest('changed-warning', {
    integration: true
  })

  it('renders', function() {
    this.render(hbs`{{changed-warning}}`)

    expect(find('i.fa.fa-warning')).to.be.ok
  })
})
