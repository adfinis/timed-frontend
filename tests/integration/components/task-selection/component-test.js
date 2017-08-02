import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | task selection', function() {
  setupComponentTest('task-selection', {
    integration: true
  })

  it('renders', function() {
    this.set('task', null)

    this.render(hbs`
      {{#task-selection task=task as |t|}}
        {{t.customer}}
        {{t.project}}
        {{t.task}}
      {{/task-selection}}
    `)

    expect(this.$('input[name="customer"]').attr('disabled')).to.not.be.ok
    expect(this.$('input[name="project"]').attr('disabled')).to.be.ok
    expect(this.$('input[name="task"]').attr('disabled')).to.be.ok
  })
})
