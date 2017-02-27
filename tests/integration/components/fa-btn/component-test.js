import { expect }             from 'chai'
import { describe, it }       from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs                    from 'htmlbars-inline-precompile'

describe('Integration | Component | fa btn', function() {
  setupComponentTest('fa-btn', {
    integration: true
  })

  it('renders', function() {
    this.render(hbs`{{fa-btn}}`)
    expect(this.$()).to.have.length(1)
  })

  it('fires an action on click', function() {
    this.on('click', () => {
      expect(true).to.be.ok
    })

    this.render(hbs`{{fa-btn 'house' on-click=(action 'click')}}`)

    this.$('.fa').click()
  })
})
