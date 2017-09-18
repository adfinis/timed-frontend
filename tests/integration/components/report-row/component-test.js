import { expect } from 'chai'
import { describe, it, beforeEach, afterEach } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import { startMirage } from 'timed/initializers/ember-cli-mirage'

describe('Integration | Component | report row', function() {
  setupComponentTest('report-row', {
    integration: true
  })

  beforeEach(function() {
    this.server = startMirage()
  })

  afterEach(function() {
    this.server.shutdown()
  })

  it('renders', function() {
    this.set('report', {})

    this.render(hbs`{{report-row report}}`)

    expect(this.$('form')).to.have.length(1)
    expect(this.$('.form-group')).to.have.length(8)
    expect(this.$('.btn-danger')).to.have.length(1)
    expect(this.$('.btn-primary')).to.have.length(1)
  })

  it('can delete row', function() {
    this.set('report', {})
    this.set('didDelete', false)

    this.render(
      hbs`{{report-row report on-delete=(action (mut didDelete) true)}}`
    )

    this.$('.btn-danger').click()

    expect(this.get('didDelete')).to.be.ok
  })
})
