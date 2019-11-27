import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'
import { render } from '@ember/test-helpers'

module('Integration | Component | no mobile message', function(hooks) {
  setupRenderingTest(hooks)

  test('renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#no-mobile-message}}
    //     template content
    //   {{/no-mobile-message}}
    // `);

    await render(hbs`{{no-mobile-message}}`)
    assert.dom(this.$()).exists({ count: 1 })
  })
})
