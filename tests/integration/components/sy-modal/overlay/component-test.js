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

  it('closes on click', function() {
    this.set('visible', true)
    this.on('close', () => this.set('visible', false))

    this.render(
      hbs`{{sy-modal/overlay visible=visible on-close=(action 'close')}}`
    )

    expect(this.get('visible')).to.be.ok

    this.$('.modal').click()

    expect(this.get('visible')).to.not.be.ok
  })

  it('does not close on click of a child element', function() {
    this.set('visible', true)
    this.on('close', () => this.set('visible', false))

    this.render(hbs`
      {{#sy-modal/overlay visible=visible on-close=(action 'close')}}
        <div id="some-child">Test</div>
      {{/sy-modal/overlay}}
    `)

    expect(this.get('visible')).to.be.ok

    this.$('.modal #some-child').click()

    expect(this.get('visible')).to.be.ok
  })
})
