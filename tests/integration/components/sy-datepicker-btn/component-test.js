import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import moment from 'moment'
import { find } from 'ember-native-dom-helpers'
import { clickTrigger } from 'timed/tests/helpers/ember-basic-dropdown'

describe('Integration | Component | sy datepicker btn', function() {
  setupComponentTest('sy-datepicker-btn', {
    integration: true
  })

  it('toggles the calendar on click of the button', function() {
    this.set('value', moment())

    this.render(
      hbs`{{sy-datepicker-btn value=value on-change=(action (mut value))}}`
    )

    expect(find('.sy-datepicker')).to.not.be.ok

    clickTrigger()

    expect(find('.sy-datepicker')).to.be.ok
  })

  it('changes value on selection', function() {
    this.set('value', moment())

    this.render(
      hbs`{{sy-datepicker-btn value=value on-change=(action (mut value))}}`
    )

    clickTrigger()

    let target = find(
      '.ember-power-calendar-day-grid .ember-power-calendar-row:last-child .ember-power-calendar-day:last-child'
    )

    target.click()

    let expected = moment()
      .endOf('month')
      .endOf('week')

    expect(this.get('value').isSame(expected, 'day')).to.be.ok
  })
})
