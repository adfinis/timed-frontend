import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import { render, find } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | no permission', function() {
  setupRenderingTest()

  it('renders', async function() {
    await render(hbs`{{no-permission}}`)

    expect(find('.empty')).to.be.ok
    expect(find('.empty').innerHTML).to.contain('Halt')
  })
})
