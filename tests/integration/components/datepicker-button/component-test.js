import { expect }             from 'chai'
import { describe, it }       from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs                    from 'htmlbars-inline-precompile'
import moment                 from 'moment'

describe('Integration | Component | datepicker button', function() {
  setupComponentTest('datepicker-button', {
    integration: true
  })

  it('renders', function() {
    this.render(hbs`{{datepicker-button}}`)

    expect(this.$('.datepicker-button-calendar')).to.have.length(0)

    this.$('button').click()

    expect(this.$('.datepicker-button-calendar')).to.have.length(1)
  })

  it('changes date on selection', function() {
    this.set('date', moment())

    this.render(hbs`{{datepicker-button current=date on-change=(action (mut date))}}`)

    this.$('button').click()

    let target = this.$('.datepicker-button-calendar .ember-power-calendar-day-grid').children().last().children().last()

    target.click()

    let expected = moment().endOf('month').endOf('week')

    expect(this.get('date').isSame(expected, 'day')).to.be.ok
  })
})
