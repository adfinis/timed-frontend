import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import moment from 'moment'
import { clickTrigger } from 'timed/tests/helpers/ember-basic-dropdown'

describe('Integration | Component | sy datepicker btn', function() {
  setupComponentTest('sy-datepicker-btn', {
    integration: true
  })

  it('renders', function() {
    this.set('value', moment())

    this.render(hbs`{{sy-datepicker-btn value=value}}`)

    expect(this.$('button')).to.have.length(1)
  })

  it('toggles the calendar on click of the button', function() {
    this.set('value', moment())

    this.render(hbs`{{sy-datepicker-btn value=value}}`)

    expect(this.$('.sy-datepicker-picker')).to.have.length(0)

    clickTrigger()

    expect(this.$('.sy-datepicker-picker')).to.have.length(1)
  })

  it('changes value on selection', function() {
    this.set('value', moment())

    this.render(
      hbs`{{sy-datepicker-btn value=value on-change=(action (mut value))}}`
    )

    clickTrigger()

    let target = this.$('.ember-power-calendar-day-grid')
      .children()
      .last()
      .children()
      .last()

    target.click()

    let expected = moment().endOf('month').endOf('week')

    expect(this.get('value').isSame(expected, 'day')).to.be.ok
  })
})
