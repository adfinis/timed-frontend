import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import { click, find, render, waitFor } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'
import moment from 'moment'
import { clickTrigger } from 'ember-basic-dropdown/test-support/helpers'

describe('Integration | Component | sy datepicker btn', function() {
  setupRenderingTest()

  it('toggles the calendar on click of the button', async function() {
    this.set('value', moment())

    await render(
      hbs`{{sy-datepicker-btn value=value on-change=(action (mut value))}}`
    )

    expect(find('.sy-datepicker')).to.not.exist

    await clickTrigger()

    await waitFor('.sy-datepicker')
    expect(find('.sy-datepicker')).to.exist
  })

  it('changes value on selection', async function() {
    this.set('value', moment())

    await render(
      hbs`{{sy-datepicker-btn value=value on-change=(action (mut value))}}`
    )

    await clickTrigger()

    await click(
      '.ember-power-calendar-day-grid .ember-power-calendar-row:last-child .ember-power-calendar-day:last-child'
    )

    let expected = moment()
      .endOf('month')
      .endOf('week')

    expect(this.get('value').isSame(expected, 'day')).to.be.ok
  })
})
