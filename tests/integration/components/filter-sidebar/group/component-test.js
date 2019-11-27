import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'
import { click, render } from '@ember/test-helpers'

module('Integration | Component | filter sidebar/group', function(hooks) {
  setupRenderingTest(hooks)

  test('renders', async function(assert) {
    await render(hbs`
      {{#filter-sidebar/group label='Group'}}
        Group content
      {{/filter-sidebar/group}}
    `)

    assert.dom('.filter-sidebar-group-label').includesText('Group')
    assert.dom('.filter-sidebar-group-body').includesText('Group content')
  })

  test('can be toggled', async function(assert) {
    await render(hbs`
      {{#filter-sidebar/group label='Group'}}
        Group content
      {{/filter-sidebar/group}}
    `)

    assert.dom('.filter-sidebar-group--expanded').doesNotExist()

    await click('.filter-sidebar-group-label')

    assert.dom('.filter-sidebar-group--expanded').exists()

    await click('.filter-sidebar-group-label')

    assert.dom('.filter-sidebar-group--expanded').doesNotExist()
  })
})
