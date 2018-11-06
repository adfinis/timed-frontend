import { find, render } from '@ember/test-helpers'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | weekly overview benchmark', function() {
  setupRenderingTest()

  it('renders', async function() {
    await render(hbs`{{weekly-overview-benchmark hours=20}}`)

    expect(this.$()).to.have.length(1)
  })

  it('computes the position correctly', async function() {
    await render(hbs`{{weekly-overview-benchmark hours=10 max=10}}`)

    expect(find('hr').getAttribute('style')).to.equal(
      'bottom: calc(100% / 10 * 10)'
    )
  })

  it('shows labels only when permitted', async function() {
    await render(hbs`{{weekly-overview-benchmark showLabel=true hours=8.5}}`)

    expect(find('span').textContent).to.equal('8.5h')
  })
})
