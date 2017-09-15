import { expect } from 'chai'
import { describe, it, beforeEach, afterEach } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import { click } from 'ember-native-dom-helpers'
import { startMirage } from 'timed/initializers/ember-cli-mirage'
import EmberObject from '@ember/object'
import Changeset from 'ember-changeset'
import moment from 'moment'

describe('Integration | Component | report reschedule row', function() {
  setupComponentTest('report-reschedule-row', {
    integration: true
  })

  beforeEach(function() {
    this.server = startMirage()
  })

  afterEach(function() {
    this.server.shutdown()
  })

  it('renders', function() {
    this.set('report', EmberObject.create({ date: moment() }))

    this.render(hbs`{{report-reschedule-row report}}`)

    expect(this.$('form')).to.have.length(1)
    expect(this.$('.form-group')).to.have.length(11)
    expect(this.$('.btn-primary')).to.have.length(1)
  })

  it('can verify a row', function() {
    this.set('report', EmberObject.create({ verifiedBy: null, date: moment() }))
    this.set('changeset', new Changeset(this.get('report'))) // pass changeset to disable verification
    this.set('savedReport', null)
    this.set('verifyUser', EmberObject.create({ id: 1, username: 'test' }))

    this.render(
      hbs`{{report-reschedule-row report changeset=changeset verifyUser=verifyUser on-save=(action (mut savedReport))}}`
    )

    click('.form-group:nth-child(10) label')
    click('.btn-primary')

    expect(this.get('savedReport.verifiedBy.username')).to.equal('test')
  })
})
