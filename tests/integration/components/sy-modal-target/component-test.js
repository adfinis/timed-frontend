import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'
import { render } from '@ember/test-helpers'

module('Integration | Component | sy modal target', function(hooks) {
  setupRenderingTest(hooks)

  test('renders', async function(assert) {
    await render(hbs`{{sy-modal-target}}`)
    assert.dom(this.$('#sy-modals')).exists({ count: 1 })
  })
})
