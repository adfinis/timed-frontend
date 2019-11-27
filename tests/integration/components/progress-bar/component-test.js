import { find, render } from '@ember/test-helpers'
import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Component | progress bar', function(hooks) {
  setupRenderingTest(hooks)

  test('renders', async function(assert) {
    await render(hbs`{{progress-bar 0.5}}`)

    assert.equal(parseInt(find('progress').getAttribute('value')), 50)
  })
})
