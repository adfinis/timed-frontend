import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | timed clock', function() {
  setupRenderingTest()

  it('renders', async function() {
    // Set any properties with this.set('myProperty', 'value')
    // Handle any actions with this.on('myAction', function(val) { ... })
    // Template block usage:
    // this.render(hbs`
    //   {{#timed-clock}}
    //     template content
    //   {{/timed-clock}}
    // `)

    await render(hbs`{{timed-clock}}`)
    expect(this.$()).to.have.length(1)
  })
})
