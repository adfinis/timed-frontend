import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import { render, click } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'
import moment from 'moment'

describe('Integration | Component | date buttons', function() {
  setupRenderingTest()

  it('changes the date', async function() {
    const format = 'YYYY-MM-DD'
    this.set('date', null)

    await render(hbs`{{date-buttons presetDate=(action (mut date))}}`)

    await click('[data-test-preset-date="0"]')
    expect(this.get('date').format(format)).to.equal(
      moment()
        .day(1)
        .format(format)
    )
    await click('[data-test-preset-date="1"]')
    expect(this.get('date').format(format)).to.equal(
      moment()
        .date(1)
        .format(format)
    )
    await click('[data-test-preset-date="2"]')
    expect(this.get('date').format(format)).to.equal(
      moment()
        .dayOfYear(1)
        .format(format)
    )
  })
})
