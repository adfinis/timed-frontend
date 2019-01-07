import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import {
  find,
  triggerKeyEvent,
  click,
  render,
  waitFor,
  fillIn,
  focus,
  blur
} from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'
import moment from 'moment'
import { clickTrigger } from 'ember-basic-dropdown/test-support/helpers'

describe('Integration | Component | sy datepicker', function() {
  setupRenderingTest()

  it('renders', async function() {
    this.set('value', moment())

    await render(
      hbs`{{sy-datepicker value=value on-change=(action (mut value))}}`
    )

    expect(find('input').value).to.equal(moment().format('DD.MM.YYYY'))
  })

  it('toggles the calendar on click of the input', async function() {
    this.set('value', moment())

    await render(
      hbs`{{sy-datepicker value=value on-change=(action (mut value))}}`
    )

    expect(find('.sy-datepicker')).to.not.be.ok

    await clickTrigger()

    await waitFor('.sy-datepicker')
    expect(find('.sy-datepicker')).to.be.ok
  })

  it('validates the input', async function() {
    this.set('value', null)

    await render(
      hbs`{{sy-datepicker value=value on-change=(action (mut value))}}`
    )

    expect(find('input').validity.valid).to.be.true

    await fillIn('input', '20.20.20')
    await triggerKeyEvent('input', 'keydown', 'Enter')

    expect(find('input').validity.valid).to.be.false

    await fillIn('input', '20.12.20')
    await triggerKeyEvent('input', 'keydown', 'Enter')

    expect(find('input').validity.valid).to.be.true
  })

  it('changes value on change (input)', async function() {
    this.set('value', moment())

    await render(
      hbs`{{sy-datepicker value=value on-change=(action (mut value))}}`
    )

    await fillIn('input', '1.2.2018')
    await triggerKeyEvent('input', 'keydown', 'Enter')

    expect(this.get('value').format('YYYY-MM-DD')).to.equal('2018-02-01')

    await fillIn('input', '')
    await triggerKeyEvent('input', 'keydown', 'Enter')

    expect(this.get('value')).to.be.null

    await fillIn('input', 'somewrongthing')
    await triggerKeyEvent('input', 'keydown', 'Enter')

    // value stays unchanged
    expect(this.get('value')).to.be.null
  })

  it('changes value on selection', async function() {
    this.set('value', moment())

    await render(
      hbs`{{sy-datepicker value=value on-change=(action (mut value))}}`
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

  it('toggles the calendar on focus and blur of the input', async function() {
    this.set('value', moment())

    await render(
      hbs`{{sy-datepicker value=value on-change=(action (mut value))}}`
    )

    expect(find('.sy-datepicker')).to.not.be.ok

    // show if focus is on input
    await focus('input')
    expect(find('.sy-datepicker')).to.be.ok

    // do not hide if focus changed into the picker
    await focus(
      '.ember-power-calendar-day-grid .ember-power-calendar-row:last-child .ember-power-calendar-day:last-child'
    )
    expect(find('.sy-datepicker')).to.be.ok

    // hide if focus changed into another element
    await blur('input')
    expect(find('.sy-datepicker')).to.not.be.ok
  })
})
