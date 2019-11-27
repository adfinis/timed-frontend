import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Component | statistic list', function(hooks) {
  setupRenderingTest(hooks)

  test('renders', async function(assert) {
    await render(hbs`{{statistic-list}}`)

    assert.dom('div').exists()
  })

  test('shows an error message', async function(assert) {
    this.set('data', { last: { isError: true } })

    await render(hbs`{{statistic-list
      data=data
      type='year'
      ordering='year'
      on-ordering-change=(action (mut ordering))
    }}`)

    assert.dom('.empty').includesText('Oops')
  })

  test('shows an empty message', async function(assert) {
    this.set('data', { last: { value: [] } })

    await render(hbs`{{statistic-list
      data=data
      type='year'
      ordering='year'
      on-ordering-change=(action (mut ordering))
    }}`)

    assert.dom('.empty').includesText('No statistics to display')
  })

  test('shows a loading icon', async function(assert) {
    this.set('data', { isRunning: true })

    await render(hbs`{{statistic-list
      data=data
      type='year'
      ordering='year'
      on-ordering-change=(action (mut ordering))
    }}`)

    assert.dom('.loading-icon').exists()
  })

  test('shows a missing parameters message', async function(assert) {
    this.set('data', { last: { value: [] } })
    this.set('missingParams', ['foo', 'bar'])

    await render(hbs`{{statistic-list
      missingParams=missingParams
      type='year'
      ordering='year'
      on-ordering-change=(action (mut ordering))
    }}`)

    assert.dom('.empty').includesText('Foo and bar are required parameters')
  })
})
