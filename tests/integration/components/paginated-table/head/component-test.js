import { module, test } from 'qunit'
import hbs from 'htmlbars-inline-precompile'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'

module('Integration | Component | paginated table/head', function(hooks) {
  setupRenderingTest(hooks)

  test('renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#paginated-table/head}}
    //     template content
    //   {{/paginated-table/head}}
    // `);

    await render(hbs`{{paginated-table/head}}`)
    assert.dom(this.$()).exists({ count: 1 })
  })
})
