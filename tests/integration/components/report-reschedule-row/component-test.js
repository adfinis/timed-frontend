import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import { click } from 'ember-native-dom-helpers'

describe('Integration | Component | report reschedule row', function() {
  setupComponentTest('report-reschedule-row', {
    integration: true
  })

  it('renders', function() {
    this.set('report', {})

    this.render(hbs`{{report-reschedule-row report}}`)

    expect(this.$('tr')).to.have.length(1)
    expect(this.$('td')).to.have.length(11)
    expect(this.$('.btn-primary')).to.have.length(1)
  })

  it('can verify a row', function() {
    this.set('report', { verifiedBy: null })
    this.set('savedReport', null)
    this.set('verifyUser', { id: 1, username: 'test' })

    this.render(
      hbs`{{report-reschedule-row report verifyUser=verifyUser on-save=(action (mut savedReport))}}`
    )

    click('td:nth-child(10) label')

    this.$('.btn-primary').click()

    expect(this.get('savedReport.verifiedBy.username')).to.equal('test')
  })
})
