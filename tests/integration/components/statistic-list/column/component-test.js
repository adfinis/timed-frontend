import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import { render } from '@ember/test-helpers'
import { find } from 'ember-native-dom-helpers'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | statistic list/column', function() {
  setupRenderingTest()

  it('renders', async function() {
    await render(hbs`{{statistic-list/column}}`)
    expect(find('td')).to.be.ok
  })
})
