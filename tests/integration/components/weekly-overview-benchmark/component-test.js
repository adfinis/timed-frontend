import { find, render } from '@ember/test-helpers'
import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Component | weekly overview benchmark', function(hooks) {
  setupRenderingTest(hooks)

  test('renders', async function(assert) {
    await render(hbs`{{weekly-overview-benchmark hours=20}}`)

    assert.ok(this.element)
  })

  test('computes the position correctly', async function(assert) {
    await render(hbs`{{weekly-overview-benchmark hours=10 max=10}}`)

    assert.equal(
      find('hr').getAttribute('style'),
      'bottom: calc(100% / 10 * 10)'
    )
  })

  test('shows labels only when permitted', async function(assert) {
    await render(hbs`{{weekly-overview-benchmark showLabel=true hours=8.5}}`)

    assert.equal(find('span').textContent, '8.5h')
  })
})
