import { click, find } from '@ember/test-helpers'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | sy modal/header', function() {
  setupComponentTest('sy-modal/header', {
    integration: true
  })

  it('renders', function() {
    this.set('visible', true)

    this.render(
      hbs`{{#sy-modal/header close=(action (mut visible) false)}}Test{{/sy-modal/header}}`
    )

    expect(find('*').textContent.trim()).to.contain('Test')
    expect(find('*').textContent.trim()).to.contain('×')
  })

  it('closes on click of the close icon', async function() {
    this.set('visible', true)

    this.render(
      hbs`{{#sy-modal/header close=(action (mut visible) false)}}Test{{/sy-modal/header}}`
    )

    expect(this.get('visible')).to.be.ok

    await click('button')

    expect(this.get('visible')).to.not.be.ok
  })
})
