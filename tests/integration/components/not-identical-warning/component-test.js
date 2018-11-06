import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'
import { find } from 'ember-native-dom-helpers'

describe('Integration | Component | not identical warning', function() {
  setupRenderingTest()

  it('renders', async function() {
    await render(hbs`{{not-identical-warning}}`)

    expect(find('i.fa.fa-info-circle')).to.be.ok
  })
})
