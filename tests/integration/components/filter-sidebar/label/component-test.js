import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import { render, find } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | filter sidebar/label', function() {
  setupRenderingTest()

  it('renders', async function() {
    await render(hbs`
      {{#filter-sidebar/label}}
        Some label
      {{/filter-sidebar/label}}
    `)

    expect(find('label')).to.not.be.null
    expect(find('label').innerHTML).to.contain('Some label')
  })
})
