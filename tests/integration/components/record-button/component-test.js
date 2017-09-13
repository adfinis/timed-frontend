import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | record button', function() {
  setupComponentTest('record-button', {
    integration: true
  })

  it('renders', function() {
    this.render(hbs`{{record-button}}`)
    expect(this.$('[data-test-record-stop]')).to.have.length(0)
  })

  it('can stop', function() {
    this.set('recording', true)

    this.on('stop', () => {
      this.set('recording', false)

      expect(this.$('[data-test-record-stop]')).to.have.length(0)
    })

    this.render(
      hbs`{{record-button recording=recording on-stop=(action 'stop')}}`
    )

    this.$('[data-test-record-stop]').click()
  })

  it('can start', function() {
    this.set('recording', false)

    this.on('start', () => {
      this.set('recording', true)

      expect(this.$('[data-test-record-stop]')).to.have.length(1)
    })

    this.render(
      hbs`{{record-button recording=recording on-start=(action 'start')}}`
    )

    this.$('[data-test-record-start]').click()
  })
})
