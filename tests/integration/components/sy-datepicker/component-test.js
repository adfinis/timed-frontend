import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import moment from 'moment'
import { find, triggerEvent, click } from 'ember-native-dom-helpers'
import { clickTrigger } from 'timed/tests/helpers/ember-basic-dropdown'

describe('Integration | Component | sy datepicker', function() {
  setupComponentTest('sy-datepicker', {
    integration: true
  })

  it('renders', function() {
    this.set('value', moment())

    this.render(
      hbs`{{sy-datepicker value=value on-change=(action (mut value))}}`
    )

    expect(find('input').value).to.be.equal(moment().format('DD.MM.YYYY'))
  })

  it('toggles the calendar on click of the input', function() {
    this.set('value', moment())

    this.render(
      hbs`{{sy-datepicker value=value on-change=(action (mut value))}}`
    )

    expect(find('.sy-datepicker')).to.not.be.ok

    clickTrigger()

    expect(find('.sy-datepicker')).to.be.ok
  })

  it('validates the input', function() {
    this.set('value', null)

    this.render(
      hbs`{{sy-datepicker value=value on-change=(action (mut value))}}`
    )

    expect(find('input').validity.valid).to.be.true

    find('input').value = '20.20.20'
    triggerEvent('input', 'input')

    expect(find('input').validity.valid).to.be.false

    find('input').value = '20.12.20'
    triggerEvent('input', 'input')

    expect(find('input').validity.valid).to.be.true
  })

  it('changes value on change (input)', function() {
    this.set('value', moment())

    this.render(
      hbs`{{sy-datepicker value=value on-change=(action (mut value))}}`
    )

    find('input').value = '1.2.2018'
    triggerEvent('input', 'change')

    expect(this.get('value').format('YYYY-MM-DD')).to.equal('2018-02-01')

    find('input').value = ''
    triggerEvent('input', 'change')

    expect(this.get('value')).to.be.null

    find('input').value = 'somewrongthing'
    triggerEvent('input', 'change')

    // value stays unchanged
    expect(this.get('value')).to.be.null
  })

  it('changes value on selection', function() {
    this.set('value', moment())

    this.render(
      hbs`{{sy-datepicker value=value on-change=(action (mut value))}}`
    )

    clickTrigger()
    click(
      '.ember-power-calendar-day-grid .ember-power-calendar-row:last-child .ember-power-calendar-day:last-child'
    )

    let expected = moment()
      .endOf('month')
      .endOf('week')

    expect(this.get('value').isSame(expected, 'day')).to.be.ok
  })

  it('toggles the calendar on focus and blur of the input', function() {
    this.set('value', moment())

    this.render(
      hbs`{{sy-datepicker value=value on-change=(action (mut value))}}`
    )

    expect(find('.sy-datepicker')).to.not.be.ok

    // show if focus is on input
    triggerEvent('input', 'focus')
    expect(find('.sy-datepicker')).to.be.ok

    // do not hide if focus changed into the picker
    triggerEvent('input', 'blur', { relatedTarget: find('.sy-datepicker') })
    expect(find('.sy-datepicker')).to.be.ok

    // hide if focus changed into another element
    triggerEvent('input', 'blur')
    expect(find('.sy-datepicker')).to.not.be.ok
  })
})
