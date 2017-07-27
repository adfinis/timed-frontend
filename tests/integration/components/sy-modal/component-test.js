import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | sy modal', function() {
  setupComponentTest('sy-modal', {
    integration: true
  })

  it('renders', function() {
    this.render(hbs`
      {{sy-modal-target}}
      {{#sy-modal visible=true as |m|}}
        {{#m.header}}
          Header
        {{/m.header}}
        {{#m.body}}
          Body
        {{/m.body}}
        {{#m.footer}}
          Footer
        {{/m.footer}}
      {{/sy-modal}}
    `)

    expect(this.$('#sy-modals').children()).to.have.length(1)

    expect(this.$('#sy-modals .modal-header').text().trim()).to.contain(
      'Header'
    )
    expect(this.$('#sy-modals .modal-header').text().trim()).to.contain('×')
    expect(this.$('#sy-modals .modal-body').text().trim()).to.equal('Body')
    expect(this.$('#sy-modals .modal-footer').text().trim()).to.equal('Footer')
  })

  it('closes on click of the close icon', function() {
    this.set('visible', true)

    this.render(hbs`
      {{sy-modal-target}}
      {{#sy-modal visible=visible as |m|}}
        {{m.header}}
      {{/sy-modal}}
    `)

    expect(this.get('visible')).to.be.ok

    this.$('#sy-modals .modal-header button').click()

    expect(this.get('visible')).to.not.be.ok
  })
})
