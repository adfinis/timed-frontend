import { render } from '@ember/test-helpers'
import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Component | sy modal/body', function(hooks) {
  setupRenderingTest(hooks)

  test('renders', async function(assert) {
    await render(hbs`{{#sy-modal/body}}Test{{/sy-modal/body}}`)

    assert.dom(this.element).hasText('Test')
  })
})
