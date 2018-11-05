import { click } from '@ember/test-helpers'
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

  it('can stop', async function() {
    this.set('recording', true)

    this.on('stop', () => {
      this.set('recording', false)

      expect(this.$('[data-test-record-stop]')).to.have.length(0)
    })

    this.render(
      hbs`{{record-button recording=recording on-stop=(action 'stop')}}`
    )

    await click('[data-test-record-stop]')
  })

  it('can start', async function() {
    this.set('recording', false)
    this.set('activity', { id: 1 })

    this.on('start', () => {
      this.set('recording', true)

      expect(this.$('[data-test-record-stop]')).to.have.length(1)
    })

    this.render(
      hbs`{{record-button recording=recording activity=activity on-start=(action 'start')}}`
    )

    await click('[data-test-record-start]')
  })
})
