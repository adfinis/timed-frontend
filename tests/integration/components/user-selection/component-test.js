import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | user selection', function() {
  setupComponentTest('user-selection', {
    integration: true
  })

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value')
    // Handle any actions with this.on('myAction', function(val) { ... })
    // Template block usage:
    // this.render(hbs`
    //   {{#user-selection}}
    //     template content
    //   {{/user-selection}}
    // `)

    this.render(hbs`{{user-selection}}`)
    expect(this.$()).to.have.length(1)
  })
})
