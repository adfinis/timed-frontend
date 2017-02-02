import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | timed clock', function() {
  setupComponentTest('timed-clock', {
    integration: true
  })

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value')
    // Handle any actions with this.on('myAction', function(val) { ... })
    // Template block usage:
    // this.render(hbs`
    //   {{#timed-clock}}
    //     template content
    //   {{/timed-clock}}
    // `)

    this.render(hbs`{{timed-clock}}`)
    expect(this.$()).to.have.length(1)
  })
})
