import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import { render, findAll } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | loading icon', function() {
  setupRenderingTest()

  it('renders', async function() {
    await render(hbs`{{loading-icon}}`)

    expect(findAll('.loading-dot')).to.have.length(9)
  })
})
