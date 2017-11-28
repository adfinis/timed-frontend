import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import { find } from 'ember-native-dom-helpers'

describe('Integration | Component | in viewport', function() {
  setupComponentTest('in-viewport', {
    integration: true
  })

  it('renders', function() {
    this.render(hbs`
      <div class="parent" style="heigth: 20px; overflow: scroll;">
        <div class="child" style="heigth: 2000px;">
          {{#in-viewport}}test{{/in-viewport}}
        </div>
      </div>
    `)

    expect(find('.child').innerHTML).to.contain('test')
  })
})
