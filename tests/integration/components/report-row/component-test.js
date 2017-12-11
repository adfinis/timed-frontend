import { expect } from 'chai'
import { describe, it, beforeEach, afterEach } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import { startMirage } from 'timed/initializers/ember-cli-mirage'
import EmberObject from '@ember/object'
import { find, findAll } from 'ember-native-dom-helpers'

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
    this.set('report', EmberObject.create({ verifiedBy: EmberObject.create() }))

    this.render(hbs`{{report-row report}}`)

    expect(this.$('form')).to.have.length(1)
    expect(this.$('.form-group')).to.have.length(8)
    expect(this.$('.btn-danger')).to.have.length(1)
    expect(this.$('.btn-primary')).to.have.length(1)
  })

  it('can delete row', function() {
    this.set('report', EmberObject.create({ verifiedBy: EmberObject.create() }))
    this.set('didDelete', false)

    this.render(
      hbs`{{report-row report on-delete=(action (mut didDelete) true)}}`
    )

    this.$('.btn-danger').click()

    expect(this.get('didDelete')).to.be.ok
  })

  it('can be read-only', function() {
    this.set(
      'report',
      EmberObject.create({
        verifiedBy: EmberObject.create({
          id: 1,
          fullName: 'John Doe'
        })
      })
    )

    this.render(hbs`{{report-row report}}`)

    expect(findAll('input').every(x => x.disabled)).to.be.true
    expect(find('form').title).to.contain('John Doe')
    expect(findAll('.btn')).to.have.length(0)

    this.set('report', EmberObject.create({ verifiedBy: EmberObject.create() }))

    expect(findAll('input').some(x => x.disabled)).to.be.false
    expect(find('form').title).to.equal('')
    expect(findAll('.btn')).to.have.length(2)
  })
})
