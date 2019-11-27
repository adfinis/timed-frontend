import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'
import { render } from '@ember/test-helpers'

module('Integration | Component | pagination limit', function(hooks) {
  setupRenderingTest(hooks)

  test('renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // await render(hbs`
    //   {{#pagination-limit}}
    //     template content
    //   {{/pagination-limit}}
    // `);

    await render(hbs`{{pagination-limit}}`)
    assert.dom(this.$()).exists({ count: 1 })
  })

  test('can change limit', async function(assert) {
    this.set('limit', 10)

    await render(hbs`{{pagination-limit pages=5 page_size=limit}}`)

    assert.dom(this.$('span')).exists({ count: 4 })
    assert.dom(this.$('a')).exists({ count: 3 })

    this.$('a:contains(100)').click()

    assert.equal(this.get('limit'), 100)
  })
})
