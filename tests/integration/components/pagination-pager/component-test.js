import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | pagination pager', function() {
  setupComponentTest('pagination-pager', {
    integration: true
  })

  it('can change limit', function() {
    this.set('limit', 10)

    this.render(hbs`{{pagination-pager limit=limit}}`)

    expect(this.$('.limit span')).to.have.length(4)
    expect(this.$('.limit a')).to.have.length(3)

    this.$('a:contains(100)').click()

    expect(this.get('limit')).to.equal(100)
  })
})
