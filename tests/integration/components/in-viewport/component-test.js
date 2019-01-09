import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import { render, find } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | in viewport', function() {
  setupRenderingTest()

  it('renders', async function() {
    await render(hbs`
      <div class="parent" style="heigth: 20px; overflow: scroll;">
        <div class="child" style="heigth: 2000px;">
          {{#in-viewport}}test{{/in-viewport}}
        </div>
      </div>
    `)

    expect(find('.child').innerHTML).to.contain('test')
  })
})
