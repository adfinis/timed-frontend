import { click, find, render } from '@ember/test-helpers'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | sy modal', function() {
  setupRenderingTest()

  it('renders', async function() {
    await render(hbs`
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

    expect(find('#sy-modals .modal-header').textContent.trim()).to.contain(
      'Header'
    )
    expect(find('#sy-modals .modal-header').textContent.trim()).to.contain('×')
    expect(find('#sy-modals .modal-body').textContent.trim()).to.equal('Body')
    expect(find('#sy-modals .modal-footer').textContent.trim()).to.equal(
      'Footer'
    )
  })

  it('closes on click of the close icon', async function() {
    this.set('visible', true)

    await render(hbs`
      {{sy-modal-target}}
      {{#sy-modal visible=visible as |m|}}
        {{m.header}}
      {{/sy-modal}}
    `)

    expect(this.get('visible')).to.be.ok

    await click('#sy-modals .modal-header button')

    expect(this.get('visible')).to.not.be.ok
  })
})
