import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import { findAll, find } from 'ember-native-dom-helpers'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | async list', function() {
  setupComponentTest('async-list', {
    integration: true
  })

  it('yields list on success', function() {
    this.set('data', { last: { value: ['a', 'b'] } })

    this.render(hbs`
      {{#async-list data as |section data|}}
        {{#if (eq section 'body')}}
          {{#each data as |d|}}
            <div class="item">{{d}}</div>
          {{/each}}
        {{/if}}
      {{/async-list}}
    `)

    expect(findAll('div.item')).to.have.length(2)
  })

  it('yields empty section', function() {
    this.set('data', { last: { value: [] } })

    this.render(hbs`
      {{#async-list data as |section data|}}
        {{#if (eq section 'empty')}}
          <div class="check-me"></div>
        {{/if}}
      {{/async-list}}
    `)

    expect(find('.check-me')).to.be.ok
  })

  it('shows loading icon', function() {
    this.set('data', { isRunning: true })

    this.render(hbs`
      {{#async-list data}}{{/async-list}}
    `)

    expect(find('.loading-icon')).to.be.ok
  })

  it('shows error message', function() {
    this.set('data', { last: { isError: true } })

    this.render(hbs`
      {{#async-list data as |section data|}}{{/async-list}}
    `)

    expect(find('.fa-bolt')).to.be.ok
  })
})
