import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | tracking indicator', function() {
  setupComponentTest('tracking-indicator', {
    integration: true
  })

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value')
    // Handle any actions with this.on('myAction', function(val) { ... })
    // Template block usage:
    // this.render(hbs`
    //   {{#tracking-indicator}}
    //     template content
    //   {{/tracking-indicator}}
    // `)

    this.render(hbs`{{tracking-indicator}}`)
    expect(this.$()).to.have.length(1)
  })
})
