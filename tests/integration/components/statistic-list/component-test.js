import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import { find } from 'ember-native-dom-helpers'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | statistic list', function() {
  setupComponentTest('statistic-list', {
    integration: true
  })

  it('renders', function() {
    this.render(hbs`{{statistic-list}}`)

    expect(find('div')).to.be.ok
  })

  it('shows an error message', function() {
    this.set('data', { last: { isError: true } })

    this.render(hbs`{{statistic-list
      data=data
      type='year'
      ordering='year'
      on-ordering-change=(action (mut ordering))
    }}`)

    expect(find('.empty').innerHTML).to.contain('Oops')
  })

  it('shows an empty message', function() {
    this.set('data', { last: { value: [] } })

    this.render(hbs`{{statistic-list
      data=data
      type='year'
      ordering='year'
      on-ordering-change=(action (mut ordering))
    }}`)

    expect(find('.empty').innerHTML).to.contain('No statistics to display')
  })

  it('shows a loading icon', function() {
    this.set('data', { isRunning: true })

    this.render(hbs`{{statistic-list
      data=data
      type='year'
      ordering='year'
      on-ordering-change=(action (mut ordering))
    }}`)

    expect(find('.loading-icon')).to.be.ok
  })

  it('shows a missing parameters message', function() {
    this.set('data', { last: { value: [] } })
    this.set('missingParams', ['foo', 'bar'])

    this.render(hbs`{{statistic-list
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
