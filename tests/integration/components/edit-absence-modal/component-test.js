import { expect }             from 'chai'
import { describe, it }       from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs                    from 'htmlbars-inline-precompile'

describe('Integration | Component | edit absence modal', function() {
  setupComponentTest('edit-absence-modal', {
    integration: true
  })

  it('renders', function() {
    this.set('report', {})

    this.render(hbs`
      {{sy-modal-target}}
      {{edit-absence-modal
        visible = true
        report  = report
      }}
    `)

    expect(this.$('#sy-modals').children()).to.have.length(1)
  })

  it('validates', function() {
    this.set('report', {})

    this.render(hbs`
      {{sy-modal-target}}
      {{edit-absence-modal
        visible = true
        report  = report
      }}
    `)

    this.$('#sy-modals button:contains(Save)').click()

    expect(this.$('#sy-modals .error-text')).to.have.length(1)
    expect(this.$('#sy-modals .error-text').first().text().trim().toLowerCase()).to.include('absence type')
    expect(this.$('#sy-modals .error-text').first().text().trim().toLowerCase()).to.include('blank')
  })
})
