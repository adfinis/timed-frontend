import { expect }             from 'chai'
import { describe, it }       from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs                    from 'htmlbars-inline-precompile'

describe('Integration | Component | edit report modal', function() {
  setupComponentTest('edit-report-modal', {
    integration: true
  })

  it('renders', function() {
    this.set('report', {})

    this.render(hbs`
      {{sy-modal-target}}
      {{edit-report-modal visible=true model=report}}
    `)

    expect(this.$('#sy-modals').children()).to.have.length(1)
  })

  it('validates', function() {
    this.set('report', {})

    this.render(hbs`
      {{sy-modal-target}}
      {{edit-report-modal visible=true model=report}}
    `)

    this.$('#sy-modals button:contains(Save)').click()

    expect(this.$('#sy-modals .error-text')).to.have.length(2)

    expect(this.$('#sy-modals .error-text:eq(0)').text().trim().toLowerCase()).to.include('task')
    expect(this.$('#sy-modals .error-text:eq(0)').text().trim().toLowerCase()).to.include('blank')

    expect(this.$('#sy-modals .error-text:eq(1)').text().trim().toLowerCase()).to.include('duration')
    expect(this.$('#sy-modals .error-text:eq(1)').text().trim().toLowerCase()).to.include('blank')
  })
})
