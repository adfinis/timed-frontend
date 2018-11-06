import { click, render } from '@ember/test-helpers'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | sort header', function() {
  setupRenderingTest()

  it('renders', async function() {
    await render(hbs`{{sort-header current='-test' by='foo'}}`)
    expect(this.$('.fa-sort')).to.have.length(1)
  })

  it('renders active state', async function() {
    this.set('current', '-test')
    this.set('update', sort => {
      this.set('current', sort)
    })

    await render(hbs`{{sort-header current=current by='test' update=update}}`)
    expect(this.$('.fa-sort-desc')).to.have.length(1)

    await click('i')
    expect(this.$('.fa-sort-asc')).to.have.length(1)
  })
})
