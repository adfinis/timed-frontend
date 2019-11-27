import { find, render } from '@ember/test-helpers'
import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Component | sy modal/footer', function(hooks) {
  setupRenderingTest(hooks)

  test('renders', async function(assert) {
    await render(hbs`{{#sy-modal/footer}}Test{{/sy-modal/footer}}`)

    assert.equal(find('*').textContent.trim(), 'Test')
  })
})
