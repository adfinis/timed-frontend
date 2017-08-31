import { expect } from 'chai'
import { describe, it, beforeEach, afterEach } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import moment from 'moment'
import { startMirage } from 'timed/initializers/ember-cli-mirage'

describe('Integration | Component | report filter', function() {
  setupComponentTest('report-filter', {
    integration: true
  })

  beforeEach(function() {
    this.server = startMirage()
  })

  afterEach(function() {
    this.server.shutdown()
  })

  it('renders', function() {
    this.render(hbs`{{report-filter}}`)
    expect(this.$()).to.have.length(1)
  })

  it('can disable filters', function() {
    this.render(hbs`{{report-filter enabledFilters=(array 'fromDate')}}`)

    expect(this.$('input')).to.have.length(1)
  })

  it('casts filters', function() {
    this.set('from', moment({ y: 2017, m: 0, d: 1 }))

    this.render(hbs`
      {{report-filter
        initial=(hash fromDate=from review=1)
        enabledFilters=(array 'fromDate' 'review')
        on-apply=(action (mut filters))
      }}
    `)

    this.$('.btn-primary').click()

    expect(this.get('filters')).to.deep.equal({
      fromDate: '2017-01-01',
      review: 1
    })
  })
})
