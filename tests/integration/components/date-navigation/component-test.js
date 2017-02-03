import { expect }             from 'chai'
import { describe, it }       from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs                    from 'htmlbars-inline-precompile'
import moment                 from 'moment'
import testSelector           from 'ember-test-selectors'

const DATE = moment({ y: 2017, m: 2, d: 10 })

describe('Integration | Component | date navigation', function() {
  setupComponentTest('date-navigation', {
    integration: true
  })

  it('renders', function() {
    this.set('date', DATE)

    this.render(hbs`{{date-navigation current=date}}`)

    expect(this.$(testSelector('current')).text()).to.equal('Tue, Jan 10, 2017')
  })

  it('can select the next day', function() {
    this.set('date', DATE)

    this.render(hbs`{{date-navigation current=date on-change=(action (mut date))}}`)

    this.$(testSelector('next')).click()

    expect(this.$(testSelector('current')).text()).to.equal('Wed, Jan 11, 2017')
  })

  it('can select the previous day', function() {
    this.set('date', DATE)

    this.render(hbs`{{date-navigation current=date on-change=(action (mut date))}}`)

    this.$(testSelector('previous')).click()

    expect(this.$(testSelector('current')).text()).to.equal('Mon, Jan 9, 2017')
  })

  it('can select the current day', function() {
    this.set('date', DATE)

    this.render(hbs`{{date-navigation current=date on-change=(action (mut date))}}`)

    this.$(testSelector('today')).click()

    expect(this.$(testSelector('current')).text()).to.equal(moment().format('ddd, ll'))
  })
})
