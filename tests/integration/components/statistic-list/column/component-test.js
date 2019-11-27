import { module, test } from 'qunit'
import hbs from 'htmlbars-inline-precompile'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'

module('Integration | Component | statistic list/column', function(hooks) {
  setupRenderingTest(hooks)

  test('renders', async function(assert) {
    await render(hbs`{{statistic-list/column}}`)
    assert.equal(find('td'), true)
  })
})
