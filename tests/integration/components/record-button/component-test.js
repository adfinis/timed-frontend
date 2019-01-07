import { find, click, render } from '@ember/test-helpers'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | record button', function() {
  setupRenderingTest()

  it('renders', async function() {
    await render(hbs`{{record-button}}`)
    expect(find('[data-test-record-stop]')).to.not.be.ok
  })

  it('can stop', async function() {
    this.set('recording', true)
    this.set('activity', { id: 1 })

    this.set('stop', () => {
      this.set('recording', false)

      expect(find('[data-test-record-stop]')).to.not.be.ok
    })

    await render(
      hbs`{{record-button recording=recording activity=activity on-stop=(action stop)}}`
    )

    await click('[data-test-record-stop]')
  })

  it('can start', async function() {
    this.set('recording', false)
    this.set('activity', { id: 1 })

    this.set('start', () => {
      this.set('recording', true)

      expect(find('[data-test-record-stop]')).to.be.ok
    })

    await render(
      hbs`{{record-button recording=recording activity=activity on-start=(action start)}}`
    )

    await click('[data-test-record-start]')
  })
})
