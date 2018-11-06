import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'
import { find } from 'ember-native-dom-helpers'

describe('Integration | Component | no permission', function() {
  setupRenderingTest()

  it('renders', async function() {
    await render(hbs`{{no-permission}}`)

    expect(find('.empty')).to.be.ok
    expect(find('.empty').innerHTML).to.contain('Halt')
  })
})
