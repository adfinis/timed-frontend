import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | paginated table/foot', function() {
  setupComponentTest('paginated-table/foot', {
    integration: true
  })

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#paginated-table/foot}}
    //     template content
    //   {{/paginated-table/foot}}
    // `);

    this.render(hbs`{{paginated-table/foot}}`)
    expect(this.$()).to.have.length(1)
  })
})
