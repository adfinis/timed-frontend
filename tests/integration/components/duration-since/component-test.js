import { find, render } from '@ember/test-helpers'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import moment from 'moment'

describe('Integration | Component | duration since', function() {
  setupRenderingTest()

  it('computes the duration correctly', async function() {
    this.set(
      'start',
      moment()
        .milliseconds(0)
        .subtract({
          minutes: 5,
          seconds: 5
        })
    )

    await render(hbs`{{duration-since start}}`)

    expect(this.$()).to.have.length(1)
    expect(find('*').textContent.trim()).to.equal('00:05:05')
  })

  it('computes the duration correctly with elapsed time', async function() {
    this.set(
      'start',
      moment().subtract({
        minutes: 5,
        seconds: 5
      })
    )

    this.set(
      'elapsed',
      moment.duration({
        hours: 1,
        minutes: 1,
        seconds: 1
      })
    )

    await render(hbs`{{duration-since start elapsed=elapsed}}`)

    expect(this.$()).to.have.length(1)
    expect(find('*').textContent.trim()).to.equal('01:06:06')
  })
})
