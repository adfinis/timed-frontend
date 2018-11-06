import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import { render } from '@ember/test-helpers'
import { find } from 'ember-native-dom-helpers'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | statistic list/bar', function() {
  setupRenderingTest()

  it('renders', async function() {
    await render(hbs`{{statistic-list/bar 0.5}}`)

    let el = find('.statistic-list-bar')

    expect(el).to.be.ok

    expect(
      window
        .getComputedStyle(el)
        .getPropertyValue('--value')
        .trim()
    ).to.equal('0.5')
  })
})
