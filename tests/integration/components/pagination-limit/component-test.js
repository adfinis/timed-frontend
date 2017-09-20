import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | pagination limit', function() {
  setupComponentTest('pagination-limit', {
    integration: true
  })

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#pagination-limit}}
    //     template content
    //   {{/pagination-limit}}
    // `);

    this.render(hbs`{{pagination-limit}}`)
    expect(this.$()).to.have.length(1)
  })

  it('can change limit', function() {
    this.set('limit', 10)

    this.render(hbs`{{pagination-limit pages=5 page_size=limit}}`)

    expect(this.$('span')).to.have.length(4)
    expect(this.$('a')).to.have.length(3)

    this.$('a:contains(100)').click()

    expect(this.get('limit')).to.equal(100)
  })
})
