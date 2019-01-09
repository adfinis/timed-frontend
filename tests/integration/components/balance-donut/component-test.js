import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import { render, find } from '@ember/test-helpers'
import moment from 'moment'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | balance donut', function() {
  setupRenderingTest()

  it('renders with a credit', async function() {
    this.set('balance', {
      credit: 10,
      usedDays: 5
    })

    await render(hbs`{{balance-donut balance}}`)

    expect(find('.donut-content').innerHTML).to.contain('5 of 10')
    expect(find('.donut-content').innerHTML).to.contain('50%')

    expect(find('.donut-segment').getAttribute('stroke-dasharray')).to.equal(
      '50 50'
    )
  })

  it('renders without a credit', async function() {
    this.set('balance', {
      credit: 0,
      usedDays: 3
    })

    await render(hbs`{{balance-donut balance}}`)

    expect(find('.donut-content').innerHTML).to.contain('3')
    expect(find('.donut-content').innerHTML).to.not.contain('0')

    expect(find('.donut-segment').getAttribute('stroke-dasharray')).to.equal(
      '100 0'
    )
  })

  it('renders with a smaller credit than used days', async function() {
    this.set('balance', {
      credit: 10,
      usedDays: 20
    })

    await render(hbs`{{balance-donut balance}}`)

    expect(find('.donut-content').innerHTML).to.contain('20 of 10')
    expect(find('.donut-content').innerHTML).to.contain('200%')

    expect(find('.donut-segment').getAttribute('stroke-dasharray')).to.equal(
      '100 0'
    )
  })

  it('renders with a duration', async function() {
    this.set('balance', {
      usedDuration: moment.duration({ h: 10 })
    })

    await render(hbs`{{balance-donut balance}}`)

    expect(find('.donut-content').innerHTML).to.contain('10:00')

    expect(find('.donut-segment').getAttribute('stroke-dasharray')).to.equal(
      '100 0'
    )
  })
})
