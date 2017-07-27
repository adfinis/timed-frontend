import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | sy checkbox', function() {
  setupComponentTest('sy-checkbox', {
    integration: true
  })

  it('works', function() {
    this.render(hbs`{{sy-checkbox label='Test Label'}}`)

    expect(this.$('label').text().trim()).to.equal('Test Label')
  })

  it('works in block style', function() {
    this.render(hbs`{{#sy-checkbox}}Test Label{{/sy-checkbox}}`)

    expect(this.$('label').text().trim()).to.equal('Test Label')
  })

  it('changes state', function() {
    this.set('checked', false)

    this.render(
      hbs`{{sy-checkbox checked=checked on-change=(action (mut checked))}}`
    )

    expect(this.$('input:checked')).to.have.length(0)

    this.$('label').click()

    expect(this.$('input:checked')).to.have.length(1)
    expect(this.get('checked')).to.be.ok
  })
})
