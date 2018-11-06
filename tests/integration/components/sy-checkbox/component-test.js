import { click, find, render } from '@ember/test-helpers'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | sy checkbox', function() {
  setupRenderingTest()

  it('works', async function() {
    await render(hbs`{{sy-checkbox label='Test Label'}}`)

    expect(find('label').textContent.trim()).to.equal('Test Label')
  })

  it('works in block style', async function() {
    await render(hbs`{{#sy-checkbox}}Test Label{{/sy-checkbox}}`)

    expect(find('label').textContent.trim()).to.equal('Test Label')
  })

  it('changes state', async function() {
    this.set('checked', false)

    await render(
      hbs`{{sy-checkbox checked=checked on-change=(action (mut checked))}}`
    )

    expect(find('input').checked).to.be.false
    expect(this.get('checked')).to.be.false

    click('label')

    expect(find('input').checked).to.be.true
    expect(this.get('checked')).to.be.true

    click('label')

    expect(find('input').checked).to.be.false
    expect(this.get('checked')).to.be.false
  })

  it('can be indeterminate', async function() {
    this.set('checked', null)

    await render(
      hbs`{{sy-checkbox checked=checked on-change=(action (mut checked))}}`
    )

    expect(find('input').indeterminate).to.be.true
    expect(this.get('checked')).to.be.null

    click('label')

    // clicking on an indeterminate checkbox makes it checked
    expect(find('input').checked).to.be.true
    expect(this.get('checked')).to.be.true
  })
})
