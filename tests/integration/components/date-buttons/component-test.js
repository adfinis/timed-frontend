import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import { click } from 'ember-native-dom-helpers'
import moment from 'moment'

describe('Integration | Component | date buttons', function() {
  setupComponentTest('date-buttons', {
    integration: true
  })

  it('changes the date', async function() {
    const format = 'YYYY-MM-DD'
    this.set('fromDate', null)
    this.set('toDate', null)

    this.render(
      hbs`{{date-buttons onUpdateFromDate=(action (mut fromDate)) onUpdateToDate=(action (mut toDate))}}`
    )

    await click('[data-test-preset-date="0"]')
    expect(this.get('fromDate').format(format)).to.equal(
      moment()
        .day(1)
        .format(format)
    )
    await click('[data-test-preset-date="1"]')
    expect(this.get('fromDate').format(format)).to.equal(
      moment()
        .date(1)
        .format(format)
    )
    await click('[data-test-preset-date="2"]')
    expect(this.get('fromDate').format(format)).to.equal(
      moment()
        .dayOfYear(1)
        .format(format)
    )
    await click('[data-test-preset-date="3"]')
    expect(this.get('fromDate').format(format)).to.equal(
      moment()
        .subtract(1, 'week')
        .day(1)
        .format(format)
    )
    expect(this.get('toDate').format(format)).to.equal(
      moment()
        .subtract(1, 'week')
        .day(7)
        .format(format)
    )
    await click('[data-test-preset-date="4"]')
    expect(this.get('fromDate').format(format)).to.equal(
      moment()
        .subtract(1, 'month')
        .startOf('month')
        .format(format)
    )
    expect(this.get('toDate').format(format)).to.equal(
      moment()
        .subtract(1, 'month')
        .endOf('month')
        .format(format)
    )
    await click('[data-test-preset-date="5"]')
    expect(this.get('fromDate').format(format)).to.equal(
      moment()
        .subtract(1, 'year')
        .startOf('year')
        .format(format)
    )
    expect(this.get('toDate').format(format)).to.equal(
      moment()
        .subtract(1, 'year')
        .endOf('year')
        .format(format)
    )
  })
})
