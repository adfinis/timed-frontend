import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'
import { find } from 'ember-native-dom-helpers'

describe('Integration | Component | changed warning', function() {
  setupRenderingTest()

  it('renders', async function() {
    await render(hbs`{{changed-warning}}`)

    expect(find('i.fa.fa-warning')).to.be.ok
  })
})
