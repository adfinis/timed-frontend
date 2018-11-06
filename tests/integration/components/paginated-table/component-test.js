import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | paginated table', function() {
  setupRenderingTest()

  it('renders', async function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#paginated-table}}
    //     template content
    //   {{/paginated-table}}
    // `);

    await render(hbs`{{paginated-table}}`)
    expect(this.$()).to.have.length(1)
  })
})
