import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import moment from 'moment'
import testSelector from 'ember-test-selectors'

const DATE = moment({ y: 2017, m: 2, d: 10 })

describe('Integration | Component | date navigation', function() {
  setupComponentTest('date-navigation', {
    integration: true
  })

  it('renders', function() {
    this.set('date', DATE)

    this.render(
      hbs`{{date-navigation current=date on-change=(action (mut date))}}`
    )

    expect(this.get('date').format('YYYY-MM-DD')).to.equal('2017-01-10')
  })

  it('can select the next day', function() {
    this.set('date', DATE)

    this.render(
      hbs`{{date-navigation current=date on-change=(action (mut date))}}`
    )

    this.$(testSelector('next')).click()

    expect(this.get('date').format('YYYY-MM-DD')).to.equal('2017-01-11')
  })

  it('can select the previous day', function() {
    this.set('date', DATE)

    this.render(
      hbs`{{date-navigation current=date on-change=(action (mut date))}}`
    )

    this.$(testSelector('previous')).click()

    expect(this.get('date').format('YYYY-MM-DD')).to.equal('2017-01-09')
  })

  it('can select the current day', function() {
    this.set('date', DATE)

    this.render(
      hbs`{{date-navigation current=date on-change=(action (mut date))}}`
    )

    this.$(testSelector('today')).click()

    expect(this.get('date').format('YYYY-MM-DD')).to.equal(
      moment().format('YYYY-MM-DD')
    )
  })
})
