import { click, render } from '@ember/test-helpers'
import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Component | record button', function(hooks) {
  setupRenderingTest(hooks)

  test('renders', async function(assert) {
    await render(hbs`{{record-button}}`)
    assert.dom(this.$('[data-test-record-stop]')).doesNotExist()
  })

  test('can stop', async function(assert) {
    this.set('recording', true)

    this.on('stop', () => {
      this.set('recording', false)

      assert.dom(this.$('[data-test-record-stop]')).doesNotExist()
    })

    await render(
      hbs`{{record-button recording=recording on-stop=(action 'stop')}}`
    )

    await click('[data-test-record-stop]')
  })

  test('can start', async function(assert) {
    this.set('recording', false)
    this.set('activity', { id: 1 })

    this.on('start', () => {
      this.set('recording', true)

      assert.dom(this.$('[data-test-record-stop]')).exist({ count: 1 })
    })

    await render(
      hbs`{{record-button recording=recording activity=activity on-start=(action 'start')}}`
    )

    await click('[data-test-record-start]')
  })
})
