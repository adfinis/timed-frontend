import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'
import { render } from '@ember/test-helpers'

module('Integration | Component | sy checkmark', function(hooks) {
  setupRenderingTest(hooks)

  test('works unchecked', async function(assert) {
    await render(hbs`{{sy-checkmark checked=false}}`)
    assert.dom('.fa-square-o').exists({ count: 1 })
  })

  test('works checked', async function(assert) {
    await render(hbs`{{sy-checkmark checked=true}}`)
    assert.dom('.fa-check-square-o').exists({ count: 1 })
  })
})
