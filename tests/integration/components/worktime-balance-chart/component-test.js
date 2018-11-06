import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | worktime balance chart', function() {
  setupRenderingTest()

  it('renders', async function() {
    await render(hbs`{{worktime-balance-chart}}`)
    expect(this.$()).to.have.length(1)
  })
})
