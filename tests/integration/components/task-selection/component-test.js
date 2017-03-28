import { expect }             from 'chai'
import { describe, it }       from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs                    from 'htmlbars-inline-precompile'
import testSelector           from 'ember-test-selectors'
import { clickTrigger }       from 'timed/tests/helpers/ember-power-select'
import { findAll, click }     from 'ember-native-dom-helpers'
import EmberObject            from 'ember-object'

// content: {} is to simulate a promise

const CUSTOMERS = [
  EmberObject.create({ id: 1, content: {}, name: 'Test Customer 1' }),
  EmberObject.create({ id: 2, content: {}, name: 'Test Customer 2' })
]

const PROJECTS = [
  EmberObject.create({ id: 1, content: {}, customer: CUSTOMERS[0], name: 'Test Project 1' }),
  EmberObject.create({ id: 2, content: {}, customer: CUSTOMERS[0], name: 'Test Project 2' }),
  EmberObject.create({ id: 3, content: {}, customer: CUSTOMERS[1], name: 'Test Project 3' }),
  EmberObject.create({ id: 4, content: {}, customer: CUSTOMERS[1], name: 'Test Project 4' })
]

const TASKS = [
  EmberObject.create({ id: 1, content: {}, project: PROJECTS[0], name: 'Test Task 1' }),
  EmberObject.create({ id: 2, content: {}, project: PROJECTS[0], name: 'Test Task 2' }),
  EmberObject.create({ id: 3, content: {}, project: PROJECTS[1], name: 'Test Task 3' }),
  EmberObject.create({ id: 4, content: {}, project: PROJECTS[1], name: 'Test Task 4' }),
  EmberObject.create({ id: 5, content: {}, project: PROJECTS[2], name: 'Test Task 5' }),
  EmberObject.create({ id: 6, content: {}, project: PROJECTS[2], name: 'Test Task 6' }),
  EmberObject.create({ id: 7, content: {}, project: PROJECTS[3], name: 'Test Task 7' }),
  EmberObject.create({ id: 8, content: {}, project: PROJECTS[3], name: 'Test Task 8' })
]

describe('Integration | Component | task selection', function() {
  setupComponentTest('task-selection', {
    integration: true
  })

  it('renders', function() {
    this.set('task', null)

    this.set('customers', CUSTOMERS)
    this.set('projects', PROJECTS)
    this.set('tasks', TASKS)

    this.render(hbs`{{task-selection
      task      = task
      customers = customers
      projects  = projects
      tasks     = tasks
      on-change = (action (mut task))
    }}`)

    expect(this.$(`${testSelector('tracking-customer')} .ember-power-select-trigger`).attr('aria-disabled')).to.not.be.ok
    expect(this.$(`${testSelector('tracking-project')} .ember-power-select-trigger`).attr('aria-disabled')).to.be.ok
    expect(this.$(`${testSelector('tracking-task')} .ember-power-select-trigger`).attr('aria-disabled')).to.be.ok
  })

  it('can select a customer', function() {
    this.set('task', null)

    this.set('customers', CUSTOMERS)
    this.set('projects', PROJECTS)
    this.set('tasks', TASKS)

    this.render(hbs`{{task-selection
      task      = task
      customers = customers
      projects  = projects
      tasks     = tasks
      on-change = (action (mut task))
    }}`)

    clickTrigger(testSelector('tracking-customer'))

    let options = findAll(`${testSelector('tracking-customer')} li.ember-power-select-option`)

    expect(options).to.have.length(2)

    click(options[0])

    expect(this.$(`${testSelector('tracking-customer')} .ember-power-select-selected-item`).text().trim()).to.equal(CUSTOMERS[0].name)

    expect(this.$(`${testSelector('tracking-customer')} .ember-power-select-trigger`).attr('aria-disabled')).to.not.be.ok
    expect(this.$(`${testSelector('tracking-project')} .ember-power-select-trigger`).attr('aria-disabled')).to.not.be.ok
    expect(this.$(`${testSelector('tracking-task')} .ember-power-select-trigger`).attr('aria-disabled')).to.be.ok
  })

  it('can select a project', function() {
    this.set('task', null)

    this.set('customers', CUSTOMERS)
    this.set('projects', PROJECTS)
    this.set('tasks', TASKS)

    this.render(hbs`{{task-selection
      task      = task
      customers = customers
      projects  = projects
      tasks     = tasks
      on-change = (action (mut task))
    }}`)

    clickTrigger(testSelector('tracking-customer'))

    click(findAll(`${testSelector('tracking-customer')} li.ember-power-select-option`)[0])

    clickTrigger(testSelector('tracking-project'))

    let options = findAll(`${testSelector('tracking-project')} li.ember-power-select-option`)

    expect(options).to.have.length(2)

    click(options[0])

    expect(this.$(`${testSelector('tracking-project')} .ember-power-select-selected-item`).text().trim()).to.equal(PROJECTS[0].name)

    expect(this.$(`${testSelector('tracking-customer')} .ember-power-select-trigger`).attr('aria-disabled')).to.not.be.ok
    expect(this.$(`${testSelector('tracking-project')} .ember-power-select-trigger`).attr('aria-disabled')).to.not.be.ok
    expect(this.$(`${testSelector('tracking-task')} .ember-power-select-trigger`).attr('aria-disabled')).to.not.be.ok
  })

  it('can select a task', function() {
    this.set('task', null)

    this.set('customers', CUSTOMERS)
    this.set('projects', PROJECTS)
    this.set('tasks', TASKS)

    this.render(hbs`{{task-selection
      task      = task
      customers = customers
      projects  = projects
      tasks     = tasks
      on-change = (action (mut task))
    }}`)

    clickTrigger(testSelector('tracking-customer'))

    click(findAll(`${testSelector('tracking-customer')} li.ember-power-select-option`)[0])

    clickTrigger(testSelector('tracking-project'))

    click(findAll(`${testSelector('tracking-project')} li.ember-power-select-option`)[0])

    clickTrigger(testSelector('tracking-task'))

    let options = findAll(`${testSelector('tracking-task')} li.ember-power-select-option`)

    expect(options).to.have.length(2)

    click(options[0])

    expect(this.$(`${testSelector('tracking-task')} .ember-power-select-selected-item`).text().trim()).to.equal(TASKS[0].name)

    expect(this.get('task')).to.equal(TASKS[0])
  })

  it('can set initial values', function() {
    this.set('task', TASKS[0])

    this.set('customers', CUSTOMERS)
    this.set('projects', PROJECTS)
    this.set('tasks', TASKS)

    this.render(hbs`{{task-selection
      task      = task
      customers = customers
      projects  = projects
      tasks     = tasks
      on-change = (action (mut task))
    }}`)

    clickTrigger(testSelector('tracking-task'))

    expect(this.$(`${testSelector('tracking-customer')} .ember-power-select-selected-item`).text().trim()).to.equal(CUSTOMERS[0].name)
    expect(this.$(`${testSelector('tracking-project')} .ember-power-select-selected-item`).text().trim()).to.equal(PROJECTS[0].name)
    expect(this.$(`${testSelector('tracking-task')} .ember-power-select-selected-item`).text().trim()).to.equal(TASKS[0].name)
  })

  it('can clear customer', function() {
    this.set('task', TASKS[0])

    this.set('customers', CUSTOMERS)
    this.set('projects', PROJECTS)
    this.set('tasks', TASKS)

    this.render(hbs`{{task-selection
      task      = task
      customers = customers
      projects  = projects
      tasks     = tasks
      on-change = (action (mut task))
    }}`)

    clickTrigger(testSelector('tracking-customer'))

    click(`${testSelector('tracking-customer')} .ember-power-select-clear-btn`)

    expect(this.$(`${testSelector('tracking-customer')} .ember-power-select-selected-item`)).to.have.length(0)
    expect(this.$(`${testSelector('tracking-project')} .ember-power-select-selected-item`)).to.have.length(0)
    expect(this.$(`${testSelector('tracking-task')} .ember-power-select-selected-item`)).to.have.length(0)

    expect(this.get('task')).to.be.null
  })

  it('can clear project', function() {
    this.set('task', TASKS[0])

    this.set('customers', CUSTOMERS)
    this.set('projects', PROJECTS)
    this.set('tasks', TASKS)

    this.render(hbs`{{task-selection
      task      = task
      customers = customers
      projects  = projects
      tasks     = tasks
      on-change = (action (mut task))
    }}`)

    clickTrigger(testSelector('tracking-project'))

    click(`${testSelector('tracking-project')} .ember-power-select-clear-btn`)

    expect(this.$(`${testSelector('tracking-customer')} .ember-power-select-selected-item`)).to.have.length(1)
    expect(this.$(`${testSelector('tracking-project')} .ember-power-select-selected-item`)).to.have.length(0)
    expect(this.$(`${testSelector('tracking-task')} .ember-power-select-selected-item`)).to.have.length(0)

    expect(this.get('task')).to.be.null
  })

  it('can clear task', function() {
    this.set('task', TASKS[0])

    this.set('customers', CUSTOMERS)
    this.set('projects', PROJECTS)
    this.set('tasks', TASKS)

    this.render(hbs`{{task-selection
      task      = task
      customers = customers
      projects  = projects
      tasks     = tasks
      on-change = (action (mut task))
    }}`)

    clickTrigger(testSelector('tracking-task'))

    click(`${testSelector('tracking-task')} .ember-power-select-clear-btn`)

    expect(this.$(`${testSelector('tracking-customer')} .ember-power-select-selected-item`)).to.have.length(1)
    expect(this.$(`${testSelector('tracking-project')} .ember-power-select-selected-item`)).to.have.length(1)
    expect(this.$(`${testSelector('tracking-task')} .ember-power-select-selected-item`)).to.have.length(0)

    expect(this.get('task')).to.be.null
  })
})
