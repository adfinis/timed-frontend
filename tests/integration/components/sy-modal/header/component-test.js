import { click, render } from '@ember/test-helpers'
import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Component | sy modal/header', function(hooks) {
  setupRenderingTest(hooks)

  test('renders', async function(assert) {
    this.set('visible', true)

    await render(hbs`
      {{#sy-modal/header
        close=(action (mut visible) false)
      }}
        Test
      {{/sy-modal/header}}
    `)

    assert.dom(this.element).hasText('Test ×')
  })

  test('closes on click of the close icon', async function(assert) {
    this.set('visible', true)

    await render(hbs`
      {{#sy-modal/header
        close=(action (mut visible) false)
      }}
        Test
      {{/sy-modal/header}}
    `)

    assert.ok(this.get('visible'))

    await click('button')

    assert.notOk(this.get('visible'))
  })
})
