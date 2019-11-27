import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'
import wait from 'ember-test-helpers/wait'
import {
  clickTrigger,
  typeInSearch
} from 'timed/tests/helpers/ember-power-select'
import { triggerKeyEvent, render } from '@ember/test-helpers'

const OPTIONS = [
  { id: 1, name: 'Test 1' },
  { id: 2, name: 'Test 2' },
  { id: 3, name: 'Test 3' }
]

module('Integration | Component | power select', function(hooks) {
  setupRenderingTest(hooks)

  test('can use blockless', async function(assert) {
    this.set('options', OPTIONS)
    this.set('selected', OPTIONS[0])

    this.set('selectedTemplate', hbs`Selected: {{selected.name}}`)
    this.set('optionTemplate', hbs`Option: {{option.name}}`)

    await render(hbs`
      {{power-select
        options            = options
        selected           = selected
        onchange           = (action (mut selected))
        tagName            = 'div'
        class              = 'select'
        renderInPlace      = true
        extra              = (hash
          optionTemplate   = optionTemplate
          selectedTemplate = selectedTemplate
        )
      }}
    `)

    await clickTrigger('.select')

    return wait().then(() => {
      assert
        .dom('.ember-power-select-selected-item')
        .hasText('Selected: Test 1')
      assert
        .dom(
          this.$('.ember-power-select-option')
            .first()
            .text()
            .trim()
        )
        .hasText('Option: Test 1')
    })
  })

  test('can select with tab', async function(assert) {
    this.set('options', OPTIONS)
    this.set('selected', OPTIONS[0])

    this.set('selectedTemplate', hbs`Selected: {{selected.name}}`)
    this.set('optionTemplate', hbs`Option: {{option.name}}`)

    await render(hbs`
      {{power-select
        options            = options
        selected           = selected
        onchange           = (action (mut selected))
        tagName            = 'div'
        class              = 'select'
        renderInPlace      = true
        searchField        = 'name'
        extra              = (hash
          optionTemplate   = optionTemplate
          selectedTemplate = selectedTemplate
        )
      }}
    `)

    await clickTrigger('.select')
    await typeInSearch('2')

    await triggerKeyEvent('.ember-power-select-search-input', 'keydown', 9)

    return wait().then(() => {
      assert.equal(this.get('selected'), 2)
    })
  })
})
