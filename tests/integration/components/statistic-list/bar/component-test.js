import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { find, render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Component | statistic list/bar', function(hooks) {
  setupRenderingTest(hooks)

  test('renders', async function(assert) {
    await render(hbs`{{statistic-list/bar 0.5}}`)

    let el = find('.statistic-list-bar')

    assert.dom(el).exists()

    assert.equal(
      window
        .getComputedStyle(el)
        .getPropertyValue('--value')
        .trim(),
      '0.5'
    )
  })
})
