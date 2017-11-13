import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import { find } from 'ember-native-dom-helpers'

describe('Integration | Component | filter sidebar/label', function() {
  setupComponentTest('filter-sidebar/label', {
    integration: true
  })

  it('renders', function() {
    this.render(hbs`
      {{#filter-sidebar/label}}
        Some label
      {{/filter-sidebar/label}}
    `)

    expect(find('label')).to.not.be.null
    expect(find('label').innerHTML).to.contain('Some label')
  })
})
