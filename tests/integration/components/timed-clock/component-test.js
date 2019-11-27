import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'
import { render } from '@ember/test-helpers'

module('Integration | Component | timed clock', function(hooks) {
  setupRenderingTest(hooks)

  test('renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value')
    // Handle any actions with this.on('myAction', function(val) { ... })
    // Template block usage:
    // this.render(hbs`
    //   {{#timed-clock}}
    //     template content
    //   {{/timed-clock}}
    // `)

    await render(hbs`{{timed-clock}}`)
    assert.length(this.$(), 1)
  })
})
