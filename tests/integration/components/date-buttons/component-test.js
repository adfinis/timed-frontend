import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | date buttons', function() {
  setupComponentTest('date-buttons', {
    integration: true
  })

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#date-buttons}}
    //     template content
    //   {{/date-buttons}}
    // `);

    this.render(hbs`{{date-buttons}}`)
    expect(this.$()).to.have.length(1)
  })
})
