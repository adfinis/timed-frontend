import { find, render } from '@ember/test-helpers'
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
    this.register('service:tracking', trackingStub)
    this.inject.service('tracking', { as: 'tracking' })
  })

  test('renders', async function(assert) {
    await render(hbs`{{tracking-bar}}`)

    assert.equal(find('input[type=text]').value, 'asdf')
  })
})
