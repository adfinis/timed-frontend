import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'
import EmberObject from '@ember/object'
import moment from 'moment'

const WorktimeBalance = EmberObject.extend({
  balance: moment.duration({ h: 10 })
})

describe('Unit | Component | worktime balance chart', function() {
  setupTest()

  it('computes the data correctly', function() {
    let dates = [...new Array(3).keys()].map(i => moment().subtract(i, 'days'))

    let component = this.owner
      .factoryFor('component:worktime-balance-chart')
      .create({
        worktimeBalances: dates.map(date => WorktimeBalance.create({ date }))
      })

    expect(
      component.get('data.labels').map(l => l.format('YYYY-MM-DD'))
    ).to.deep.equal(dates.map(d => d.format('YYYY-MM-DD')))

    expect(component.get('data.datasets')).to.deep.equal([
      { data: [10, 10, 10] }
    ])
  })

  it('computes tooltip correctly', function() {
    let component = this.owner
      .factoryFor('component:worktime-balance-chart')
      .create()

    let titleFn = component.get('options.tooltips.callbacks.title')
    let labelFn = component.get('options.tooltips.callbacks.label')

    expect(titleFn([{ index: 0 }], { labels: [moment()] })).to.equal(
      moment().format('DD.MM.YYYY')
    )
    expect(labelFn({ yLabel: 10.5 })).to.equal('10h 30m')
  })
})
