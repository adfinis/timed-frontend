import { find } from '@ember/test-helpers'
import { expect } from 'chai'
import { describe, it, beforeEach } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
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

describe('Integration | Component | tracking bar', function() {
  setupComponentTest('tracking-bar', {
    integration: true
  })

  beforeEach(function() {
    this.register('service:tracking', trackingStub)
    this.inject.service('tracking', { as: 'tracking' })
  })

  it('renders', function() {
    this.render(hbs`{{tracking-bar}}`)

    expect(find('input[type=text]').value).to.equal('asdf')
  })
})
