import { expect }             from 'chai'
import { describe, it }       from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs                    from 'htmlbars-inline-precompile'

describe('Integration | Component | edit activity modal', function() {
  setupComponentTest('edit-activity-modal', {
    integration: true
  })

  it('renders', function() {
    this.set('activity', {})

    this.on('search', () => [])

    this.render(hbs`
      {{sy-modal-target}}
      {{edit-activity-modal
        visible             = true
        model               = activity
        on-search-customers = (action 'search')
        on-filter-projects  = (action 'search')
        on-filter-tasks     = (action 'search')
      }}
    `)

    expect(this.$('#sy-modals').children()).to.have.length(1)
  })
})
