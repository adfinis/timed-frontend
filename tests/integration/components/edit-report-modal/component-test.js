import { expect }             from 'chai'
import { describe, it }       from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs                    from 'htmlbars-inline-precompile'
import EmberObject            from 'ember-object'
import moment                 from 'moment'

import {
  CUSTOMERS,
  PROJECTS,
  TASKS
} from 'timed/tests/integration/components/task-selection/component-test'

const REPORT = EmberObject.create({
  task: TASKS[0],
  duration: moment.duration({ h: 5, m: 30 }),
  notBillable: false,
  review: false,
  comment: 'Test comment 12345'
})

describe('Integration | Component | edit report modal', function() {
  setupComponentTest('edit-report-modal', {
    integration: true
  })

  it('renders', function() {
    this.set('report', {})

    this.render(hbs`
      {{sy-modal-target}}
      {{edit-report-modal
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
      {{edit-report-modal
        visible = true
        report  = report
      }}
    `)

    this.$('#sy-modals button:contains(Save)').click()

    expect(this.$('#sy-modals .error-text')).to.have.length(1)
    expect(this.$('#sy-modals .error-text').first().text().trim().toLowerCase()).to.include('task')
    expect(this.$('#sy-modals .error-text').first().text().trim().toLowerCase()).to.include('blank')
  })

  it('can save', function() {
    this.set('report', REPORT)

    this.set('customers', CUSTOMERS)
    this.set('projects', PROJECTS)
    this.set('tasks', TASKS)

    this.render(hbs`
      {{sy-modal-target}}
      {{edit-report-modal
        visible   = true
        report    = report
        customers = customers
        projects  = projects
        tasks     = tasks
        on-save   = (action (mut report))
      }}
    `)

    expect(this.get('report.notBillable')).to.not.be.ok
    expect(this.get('report.comment')).to.equal(this.get('report.comment'))

    this.$('#sy-modals .checkbox input').first().click()
    this.$('#sy-modals textarea').val('...').change()

    this.$('#sy-modals button:contains(Save)').click()

    expect(this.get('report.notBillable')).to.be.ok
    expect(this.get('report.comment')).to.equal('...')
  })

  it('can delete', function() {
    this.set('didDelete', false)

    this.set('report', REPORT)

    this.set('customers', CUSTOMERS)
    this.set('projects', PROJECTS)
    this.set('tasks', TASKS)

    this.render(hbs`
      {{sy-modal-target}}
      {{edit-report-modal
        visible   = true
        report    = report
        customers = customers
        projects  = projects
        tasks     = tasks
        on-delete = (action (mut didDelete) true)
      }}
    `)

    this.$('#sy-modals button:contains(Delete)').click()

    expect(this.get('didDelete')).to.be.ok
  })

  it('can close', function() {
    this.set('didClose', false)

    this.set('report', REPORT)

    this.set('customers', CUSTOMERS)
    this.set('projects', PROJECTS)
    this.set('tasks', TASKS)

    this.render(hbs`
      {{sy-modal-target}}
      {{edit-report-modal
        visible   = true
        report    = report
        customers = customers
        projects  = projects
        tasks     = tasks
        on-close  = (action (mut didClose) true)
      }}
    `)

    expect(this.$('#sy-modals .modal--visible')).to.have.length(1)

    this.$('#sy-modals button:contains(×)').click()

    expect(this.get('didClose')).to.be.ok

    expect(this.$('#sy-modals .modal--visible')).to.have.length(0)
  })
})
