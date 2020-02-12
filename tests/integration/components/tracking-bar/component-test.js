import { render } from '@ember/test-helpers'
import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { task } from 'ember-concurrency'
import hbs from 'htmlbars-inline-precompile'
import Service from '@ember/service'

export const trackingStub = Service.extend({
  init() {
    this._super(...arguments)

    this.set('activity', { comment: 'asdf' })
  },

  customers: task(function*() {
    return yield []
  }),
  recentTasks: task(function*() {
    return yield []
  })
})

module('Integration | Component | tracking bar', function(hooks) {
  setupRenderingTest(hooks)

  hooks.beforeEach(function() {
    this.owner.register('service:tracking', trackingStub)
  })

  test('renders', async function(assert) {
    await render(hbs`{{tracking-bar}}`)

    assert.dom('input[type=text]').hasValue('asdf')
  })
})
