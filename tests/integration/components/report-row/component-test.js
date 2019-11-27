import { click, render, find, findAll } from '@ember/test-helpers'
import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'
import { startMirage } from 'timed/initializers/ember-cli-mirage'
import EmberObject from '@ember/object'

module('Integration | Component | report row', function(hooks) {
  setupRenderingTest(hooks)

  hooks.beforeEach(function() {
    this.server = startMirage()
  })

  hooks.afterEach(function() {
    this.server.shutdown()
  })

  test('renders', async function(assert) {
    this.set('report', EmberObject.create({ verifiedBy: EmberObject.create() }))

    await render(hbs`{{report-row report}}`)

    assert.dom(this.$('form')).exists({ count: 1 })
    assert.dom(this.$('.form-group')).exists({ count: 8 })
    assert.dom(this.$('.btn-danger')).exists({ count: 1 })
    assert.dom(this.$('.btn-primary')).exists({ count: 1 })
  })

  test('can delete row', async function(assert) {
    this.set('report', EmberObject.create({ verifiedBy: EmberObject.create() }))
    this.set('didDelete', false)

    await render(
      hbs`{{report-row report on-delete=(action (mut didDelete) true)}}`
    )

    await click('.btn-danger')

    assert.ok(this.get('didDelete'))
  })

  test('can be read-only', async function(assert) {
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

    assert.ok(findAll('input').every(x => x.disabled))
    assert.dom(find('form').title).includesText('John Doe')
    assert.dom('.btn').doesNotExist()

    this.set('report', EmberObject.create({ verifiedBy: EmberObject.create() }))

    assert.notOk(findAll('input').some(x => x.disabled))
    assert.dom(find('form').title).hasText('')
    assert.dom('.btn').exists({ count: 2 })
  })
})
