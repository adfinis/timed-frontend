import { find, render } from '@ember/test-helpers'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | progress bar', function() {
  setupRenderingTest()

  it('renders', async function() {
    await render(hbs`{{progress-bar 0.5}}`)

    expect(parseInt(find('progress').getAttribute('value'))).to.equal(50)
  })
})
