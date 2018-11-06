import { find, render } from '@ember/test-helpers'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | sy modal/body', function() {
  setupRenderingTest()

  it('renders', async function() {
    await render(hbs`{{#sy-modal/body}}Test{{/sy-modal/body}}`)

    expect(find('*').textContent.trim()).to.equal('Test')
  })
})
