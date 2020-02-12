import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'
import { render } from '@ember/test-helpers'

module('Integration | Component | paginated table', function(hooks) {
  setupRenderingTest(hooks)

  test('renders', async function(assert) {
    await render(hbs`{{paginated-table}}`)
    assert.ok(this.element)
  })
})
