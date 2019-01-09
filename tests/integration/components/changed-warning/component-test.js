import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import { render, find } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | changed warning', function() {
  setupRenderingTest()

  it('renders', async function() {
    await render(hbs`{{changed-warning}}`)

    expect(find('i.fa.fa-warning')).to.be.ok
  })
})
