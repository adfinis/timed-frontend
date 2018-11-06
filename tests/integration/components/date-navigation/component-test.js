import { click, render } from '@ember/test-helpers'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import moment from 'moment'

const DATE = moment({ y: 2017, m: 2, d: 10 })

describe('Integration | Component | date navigation', function() {
  setupRenderingTest()

  it('renders', async function() {
    this.set('date', DATE)

    await render(
      hbs`{{date-navigation current=date on-change=(action (mut date))}}`
    )

    expect(this.get('date').format('YYYY-MM-DD')).to.equal('2017-01-10')
  })

  it('can select the next day', async function() {
    this.set('date', DATE)

    await render(
      hbs`{{date-navigation current=date on-change=(action (mut date))}}`
    )

    await click('[data-test-next]')

    expect(this.get('date').format('YYYY-MM-DD')).to.equal('2017-01-11')
  })

  it('can select the previous day', async function() {
    this.set('date', DATE)

    await render(
      hbs`{{date-navigation current=date on-change=(action (mut date))}}`
    )

    await click('[data-test-previous]')

    expect(this.get('date').format('YYYY-MM-DD')).to.equal('2017-01-09')
  })

  it('can select the current day', async function() {
    this.set('date', DATE)

    await render(
      hbs`{{date-navigation current=date on-change=(action (mut date))}}`
    )

    await click('[data-test-today]')

    expect(this.get('date').format('YYYY-MM-DD')).to.equal(
      moment().format('YYYY-MM-DD')
    )
  })
})
