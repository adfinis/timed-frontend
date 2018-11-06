import { click, render } from '@ember/test-helpers'
import { expect } from 'chai'
import { describe, it, beforeEach, afterEach } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import { startMirage } from 'timed/initializers/ember-cli-mirage'
import EmberObject from '@ember/object'
import { find, findAll } from 'ember-native-dom-helpers'

describe('Integration | Component | report row', function() {
  setupRenderingTest()

  beforeEach(function() {
    this.server = startMirage()
  })

  afterEach(function() {
    this.server.shutdown()
  })

  it('renders', async function() {
    this.set('report', EmberObject.create({ verifiedBy: EmberObject.create() }))

    await render(hbs`{{report-row report}}`)

    expect(this.$('form')).to.have.length(1)
    expect(this.$('.form-group')).to.have.length(8)
    expect(this.$('.btn-danger')).to.have.length(1)
    expect(this.$('.btn-primary')).to.have.length(1)
  })

  it('can delete row', async function() {
    this.set('report', EmberObject.create({ verifiedBy: EmberObject.create() }))
    this.set('didDelete', false)

    await render(
      hbs`{{report-row report on-delete=(action (mut didDelete) true)}}`
    )

    await click('.btn-danger')

    expect(this.get('didDelete')).to.be.ok
  })

  it('can be read-only', async function() {
    this.set(
      'report',
      EmberObject.create({
        verifiedBy: EmberObject.create({
          id: 1,
          fullName: 'John Doe'
        })
      })
    )

    await render(hbs`{{report-row report}}`)

    expect(findAll('input').every(x => x.disabled)).to.be.true
    expect(find('form').title).to.contain('John Doe')
    expect(findAll('.btn')).to.have.length(0)

    this.set('report', EmberObject.create({ verifiedBy: EmberObject.create() }))

    expect(findAll('input').some(x => x.disabled)).to.be.false
    expect(find('form').title).to.equal('')
    expect(findAll('.btn')).to.have.length(2)
  })
})
