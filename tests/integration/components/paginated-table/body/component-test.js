import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | paginated table/body', function() {
  setupComponentTest('paginated-table/body', {
    integration: true
  })

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#paginated-table/body}}
    //     template content
    //   {{/paginated-table/body}}
    // `);

    this.render(hbs`{{paginated-table/body}}`)
    expect(this.$()).to.have.length(1)
  })
})
