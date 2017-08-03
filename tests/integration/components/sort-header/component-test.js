import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | sort header', function() {
  setupComponentTest('sort-header', {
    integration: true
  })

  it('renders', function() {
    this.render(hbs`{{sort-header current='-test' by='foo'}}`)
    expect(this.$('.fa-sort')).to.have.length(1)
  })

  it('renders active state', function() {
    this.set('current', '-test')
    this.set('update', sort => {
      this.set('current', sort)
    })

    this.render(hbs`{{sort-header current=current by='test' update=update}}`)
    expect(this.$('.fa-sort-desc')).to.have.length(1)

    this.$('i').click()
    expect(this.$('.fa-sort-asc')).to.have.length(1)
  })
})
