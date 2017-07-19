import { expect }             from 'chai'
import { describe, it }       from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs                    from 'htmlbars-inline-precompile'

describe('Integration | Component | report row', function() {
  setupComponentTest('report-row', {
    integration: true
  })

  it('renders', function() {
    this.set('report', {})

    this.render(hbs`{{report-row report}}`)

    expect(this.$('tr')).to.have.length(1)
    expect(this.$('td')).to.have.length(8)
    expect(this.$('.btn-danger')).to.have.length(1)
    expect(this.$('.btn-primary')).to.have.length(1)
  })

  it('can delete row', function() {
    this.set('report', {})
    this.set('didDelete', false)

    this.render(hbs`{{report-row report on-delete=(action (mut didDelete) true)}}`)

    this.$('.btn-danger').click()

    expect(this.get('didDelete')).to.be.ok
  })
})
