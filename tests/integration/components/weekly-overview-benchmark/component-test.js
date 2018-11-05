import { find } from '@ember/test-helpers'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | weekly overview benchmark', function() {
  setupComponentTest('weekly-overview-benchmark', {
    integration: true
  })

  it('renders', function() {
    this.render(hbs`{{weekly-overview-benchmark hours=20}}`)

    expect(this.$()).to.have.length(1)
  })

  it('computes the position correctly', function() {
    this.render(hbs`{{weekly-overview-benchmark hours=10 max=10}}`)

    expect(find('hr').getAttribute('style')).to.equal(
      'bottom: calc(100% / 10 * 10)'
    )
  })

  it('shows labels only when permitted', function() {
    this.render(hbs`{{weekly-overview-benchmark showLabel=true hours=8.5}}`)

    expect(find('span').textContent).to.equal('8.5h')
  })
})
