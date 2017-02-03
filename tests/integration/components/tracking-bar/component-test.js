import { expect }             from 'chai'
import { describe, it }       from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs                    from 'htmlbars-inline-precompile'

describe('Integration | Component | tracking bar', function() {
  setupComponentTest('tracking-bar', {
    integration: true
  })

  it('renders', function() {
    this.set('activity', { comment: 'asdf' })

    this.render(hbs`{{tracking-bar activity=activity}}`)

    expect(this.$('input[type=text]').val()).to.equal('asdf')
  })
})
