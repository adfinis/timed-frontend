import { find, render } from '@ember/test-helpers'
import { expect } from 'chai'
import { describe, it, beforeEach } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
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
  setupRenderingTest()

  beforeEach(function() {
    this.owner.register('service:tracking', trackingStub)
    this.tracking = this.owner.lookup('service:tracking')
  })

  it('renders', async function() {
    await render(hbs`{{tracking-bar}}`)

    expect(find('input[type=text]').value).to.equal('asdf')
  })
})
