import { expect }             from 'chai'
import { describe, it }       from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs                    from 'htmlbars-inline-precompile'
import moment                 from 'moment'

describe('Integration | Component | weekly overview', function() {
  setupComponentTest('weekly-overview', {
    integration: true
  })

  it('renders', function() {
    this.set('expected', moment.duration({ h: 8 }))

    this.render(hbs`{{weekly-overview expected=expected}}`)

    expect(this.$()).to.have.length(1)
  })

  it('renders the benchmarks', function() {
    this.set('expected', moment.duration({ h: 8 }))

    this.render(hbs`{{weekly-overview expected=expected}}`)

    expect(this.$('hr')).to.have.length(12) // 11 (evens from 0 to 20) plus the expected
  })

  it('renders the days', function() {
    this.set('day',      moment())
    this.set('expected', moment.duration({ h: 8 }))
    this.set('worktime', moment.duration({ h: 8 }))

    this.render(hbs`
      {{#weekly-overview expected=expected}}
        {{weekly-overview-day day=day expected=expected worktime=worktime}}
      {{/weekly-overview}}
    `)

    expect(this.$('.bar')).to.have.length(1)
  })
})
