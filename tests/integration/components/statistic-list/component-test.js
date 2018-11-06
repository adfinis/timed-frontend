import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import { render } from '@ember/test-helpers'
import { find } from 'ember-native-dom-helpers'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | statistic list', function() {
  setupRenderingTest()

  it('renders', async function() {
    await render(hbs`{{statistic-list}}`)

    expect(find('div')).to.be.ok
  })

  it('shows an error message', async function() {
    this.set('data', { last: { isError: true } })

    await render(hbs`{{statistic-list
      data=data
      type='year'
      ordering='year'
      on-ordering-change=(action (mut ordering))
    }}`)

    expect(find('.empty').innerHTML).to.contain('Oops')
  })

  it('shows an empty message', async function() {
    this.set('data', { last: { value: [] } })

    await render(hbs`{{statistic-list
      data=data
      type='year'
      ordering='year'
      on-ordering-change=(action (mut ordering))
    }}`)

    expect(find('.empty').innerHTML).to.contain('No statistics to display')
  })

  it('shows a loading icon', async function() {
    this.set('data', { isRunning: true })

    await render(hbs`{{statistic-list
      data=data
      type='year'
      ordering='year'
      on-ordering-change=(action (mut ordering))
    }}`)

    expect(find('.loading-icon')).to.be.ok
  })

  it('shows a missing parameters message', async function() {
    this.set('data', { last: { value: [] } })
    this.set('missingParams', ['foo', 'bar'])

    await render(hbs`{{statistic-list
      missingParams=missingParams
      type='year'
      ordering='year'
      on-ordering-change=(action (mut ordering))
    }}`)

    expect(find('.empty').innerHTML).to.contain(
      'Foo and bar are required parameters'
    )
  })
})
