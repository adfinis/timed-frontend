import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | sy checkmark', function() {
  setupRenderingTest()

  it('works unchecked', async function() {
    await render(hbs`{{sy-checkmark checked=false}}`)
    expect(this.$('.fa-square-o')).to.have.length(1)
  })

  it('works checked', async function() {
    await render(hbs`{{sy-checkmark checked=true}}`)
    expect(this.$('.fa-check-square-o')).to.have.length(1)
  })
})
