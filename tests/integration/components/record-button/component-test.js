import { click, render } from '@ember/test-helpers'
import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Component | record button', function(hooks) {
  setupRenderingTest(hooks)

  test('renders', async function(assert) {
    await render(hbs`{{record-button}}`)
    assert.dom('[data-test-record-stop]').doesNotExist()
  })

  test('can stop', async function(assert) {
    this.set('recording', true)
    this.set('activity', { id: 1 })

    this.set('stopAction', () => {
      this.set('recording', false)

      assert.dom('[data-test-record-stop]').doesNotExist()
    })

    await render(hbs`
      {{record-button
        recording=recording
        activity=activity
        on-stop=stopAction
      }}
    `)

    await click('[data-test-record-stop]')
  })

  test('can start', async function(assert) {
    this.set('recording', false)
    this.set('activity', { id: 1 })

    this.set('startAction', () => {
      this.set('recording', true)

      assert.dom('[data-test-record-stop]').exists({ count: 1 })
    })

    await render(hbs`
      {{record-button
        recording=recording
        activity=activity
        on-start=startAction
      }}
    `)

    await click('[data-test-record-start]')
  })
})
