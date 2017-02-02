import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | attendance slider', function() {
  setupComponentTest('attendance-slider', {
    integration: true
  })

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value')
    // Handle any actions with this.on('myAction', function(val) { ... })
    // Template block usage:
    // this.render(hbs`
    //   {{#attendance-slider}}
    //     template content
    //   {{/attendance-slider}}
    // `)

    this.render(hbs`{{attendance-slider}}`)
    expect(this.$()).to.have.length(1)
  })
})
