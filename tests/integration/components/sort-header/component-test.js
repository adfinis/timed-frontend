import { click, render } from '@ember/test-helpers'
import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Component | sort header', function(hooks) {
  setupRenderingTest(hooks)

  test('renders', async function(assert) {
    await render(hbs`{{sort-header current='-test' by='foo'}}`)
    assert.dom(this.$('.fa-sort')).exists({ count: 1 })
  })

  test('renders active state', async function(assert) {
    this.set('current', '-test')
    this.set('update', sort => {
      this.set('current', sort)
    })

    await render(hbs`{{sort-header current=current by='test' update=update}}`)
    assert.dom(this.$('.fa-sort-desc')).exists({ count: 1 })

    await click('i')
    assert.dom(this.$('.fa-sort-asc')).exists({ count: 1 })
  })
})
