import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import { find } from 'ember-native-dom-helpers'
import moment from 'moment'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | balance donut', function() {
  setupComponentTest('balance-donut', {
    integration: true
  })

  it('renders with a credit', function() {
    this.set('balance', {
      credit: 10,
      usedDays: 5
    })

    this.render(hbs`{{balance-donut balance}}`)

    expect(find('.donut-content').innerHTML).to.contain('5 of 10')
    expect(find('.donut-content').innerHTML).to.contain('50%')

    expect(find('.donut-segment').getAttribute('stroke-dasharray')).to.equal(
      '50 50'
    )
  })

  it('renders without a credit', function() {
    this.set('balance', {
      credit: 0,
      usedDays: 3
    })

    this.render(hbs`{{balance-donut balance}}`)

    expect(find('.donut-content').innerHTML).to.contain('3')
    expect(find('.donut-content').innerHTML).to.not.contain('0')

    expect(find('.donut-segment').getAttribute('stroke-dasharray')).to.equal(
      '100 0'
    )
  })

  it('renders with a smaller credit than used days', function() {
    this.set('balance', {
      credit: 10,
      usedDays: 20
    })

    this.render(hbs`{{balance-donut balance}}`)

    expect(find('.donut-content').innerHTML).to.contain('20 of 10')
    expect(find('.donut-content').innerHTML).to.contain('200%')

    expect(find('.donut-segment').getAttribute('stroke-dasharray')).to.equal(
      '100 0'
    )
  })

  it('renders with a duration', function() {
    this.set('balance', {
      usedDuration: moment.duration({ h: 10 })
    })

    this.render(hbs`{{balance-donut balance}}`)

    expect(find('.donut-content').innerHTML).to.contain('10:00')

    expect(find('.donut-segment').getAttribute('stroke-dasharray')).to.equal(
      '100 0'
    )
  })
})
