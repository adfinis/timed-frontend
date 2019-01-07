import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import { find, click, render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

describe('Integration | Component | filter sidebar/group', function() {
  setupRenderingTest()

  it('renders', async function() {
    await render(hbs`
      {{#filter-sidebar/group label='Group'}}
        Group content
      {{/filter-sidebar/group}}
    `)

    expect(find('.filter-sidebar-group-label').innerHTML).to.contain('Group')
    expect(find('.filter-sidebar-group-body').innerHTML).to.contain(
      'Group content'
    )
  })

  it('can be toggled', async function() {
    await render(hbs`
      {{#filter-sidebar/group label='Group'}}
        Group content
      {{/filter-sidebar/group}}
    `)

    expect(find('.filter-sidebar-group--expanded')).to.not.be.ok

    await click('.filter-sidebar-group-label')

    expect(find('.filter-sidebar-group--expanded')).to.be.ok

    await click('.filter-sidebar-group-label')

    expect(find('.filter-sidebar-group--expanded')).to.not.be.ok
  })
})
