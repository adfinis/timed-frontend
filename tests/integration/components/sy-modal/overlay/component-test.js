import { click, render } from '@ember/test-helpers'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | sy modal/overlay', function() {
  setupRenderingTest()

  it('renders', async function() {
    await render(hbs`{{sy-modal/overlay}}`)

    expect(this.$()).to.have.length(1)
  })

  it('closes on click', async function() {
    this.set('visible', true)
    this.set('close', () => this.set('visible', false))

    await render(
      hbs`{{sy-modal/overlay visible=visible on-close=(action close)}}`
    )

    expect(this.get('visible')).to.be.ok

    await click('.modal')

    expect(this.get('visible')).to.not.be.ok
  })

  it('does not close on click of a child element', async function() {
    this.set('visible', true)
    this.set('close', () => this.set('visible', false))

    await render(hbs`
      {{#sy-modal/overlay visible=visible on-close=(action close)}}
        <div id="some-child">Test</div>
      {{/sy-modal/overlay}}
    `)

    expect(this.get('visible')).to.be.ok

    await click('.modal #some-child')

    expect(this.get('visible')).to.be.ok
  })
})
