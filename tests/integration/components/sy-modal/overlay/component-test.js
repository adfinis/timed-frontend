import { click } from '@ember/test-helpers'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | sy modal/overlay', function() {
  setupComponentTest('sy-modal/overlay', {
    integration: true
  })

  it('renders', function() {
    this.render(hbs`{{sy-modal/overlay}}`)

    expect(this.$()).to.have.length(1)
  })

  it('closes on click', async function() {
    this.set('visible', true)
    this.on('close', () => this.set('visible', false))

    this.render(
      hbs`{{sy-modal/overlay visible=visible on-close=(action 'close')}}`
    )

    expect(this.get('visible')).to.be.ok

    await click('.modal')

    expect(this.get('visible')).to.not.be.ok
  })

  it('does not close on click of a child element', async function() {
    this.set('visible', true)
    this.on('close', () => this.set('visible', false))

    this.render(hbs`
      {{#sy-modal/overlay visible=visible on-close=(action 'close')}}
        <div id="some-child">Test</div>
      {{/sy-modal/overlay}}
    `)

    expect(this.get('visible')).to.be.ok

    await click('.modal #some-child')

    expect(this.get('visible')).to.be.ok
  })
})
