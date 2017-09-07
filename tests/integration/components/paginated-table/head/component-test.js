import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | paginated table/head', function() {
  setupComponentTest('paginated-table/head', {
    integration: true
  })

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#paginated-table/head}}
    //     template content
    //   {{/paginated-table/head}}
    // `);

    this.render(hbs`{{paginated-table/head}}`)
    expect(this.$()).to.have.length(1)
  })
})
