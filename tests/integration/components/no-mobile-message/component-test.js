import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | no mobile message', function() {
  setupRenderingTest()

  it('renders', async function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#no-mobile-message}}
    //     template content
    //   {{/no-mobile-message}}
    // `);

    await render(hbs`{{no-mobile-message}}`)
    expect(this.$()).to.have.length(1)
  })
})
