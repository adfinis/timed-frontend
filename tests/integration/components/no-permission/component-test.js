import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import { find } from 'ember-native-dom-helpers'

describe('Integration | Component | no permission', function() {
  setupComponentTest('no-permission', {
    integration: true
  })

  it('renders', function() {
    this.render(hbs`{{no-permission}}`)

    expect(find('.empty')).to.be.ok
    expect(find('.empty').innerHTML).to.contain('Halt')
  })
})
