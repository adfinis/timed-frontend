import { click, render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'
import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'

module('Integration | Component | sy modal/overlay', function(hooks) {
  setupRenderingTest(hooks)

  test('renders', async function(assert) {
    await render(hbs`{{sy-modal/overlay}}`)
    assert.ok(this.element)
  })

  test('closes on click', async function(assert) {
    this.set('visible', true)
    this.set('closeAction', () => this.set('visible', false))

    await render(hbs`
      {{sy-modal/overlay
        visible=visible
        on-close=closeAction
      }}
    `)

    assert.ok(this.get('visible'))

    await click('.modal')

    assert.notOk(this.get('visible'))
  })

  test('does not close on click of a child element', async function(assert) {
    this.set('visible', true)
    this.set('closeAction', () => this.set('visible', false))

    await render(hbs`
      {{#sy-modal/overlay visible=visible on-close=closeAction}}
        <div id="some-child">Test</div>
      {{/sy-modal/overlay}}
    `)

    assert.ok(this.get('visible'))

    await click('#some-child')

    assert.ok(this.get('visible'))
  })
})
