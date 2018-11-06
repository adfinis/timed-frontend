import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | sy modal target', function() {
  setupRenderingTest()

  it('renders', async function() {
    await render(hbs`{{sy-modal-target}}`)
    expect(this.$('#sy-modals')).to.have.length(1)
  })
})
