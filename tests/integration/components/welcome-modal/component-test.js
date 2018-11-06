import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | welcome modal', function() {
  setupRenderingTest()

  it('renders', async function() {
    await render(hbs`{{sy-modal-target}}{{welcome-modal visible=true}}`)
    expect(this.$()).to.have.length(1)
  })
})
