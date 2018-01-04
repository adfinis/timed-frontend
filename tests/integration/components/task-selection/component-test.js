import { expect } from 'chai'
import { describe, it, beforeEach, afterEach } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import { startMirage } from 'timed/initializers/ember-cli-mirage'
import EmberObject from '@ember/object'
import wait from 'ember-test-helpers/wait'

const CUSTOMER = EmberObject.create({
  id: 1,
  name: 'Test Customer'
})

const PROJECT = EmberObject.create({
  id: 1,
  name: 'Test Project',
  customer: CUSTOMER
})

const TASK = EmberObject.create({
  id: 1,
  name: 'Test Task',
  project: PROJECT
})

describe('Integration | Component | task selection', function() {
  setupComponentTest('task-selection', {
    integration: true
  })

  beforeEach(function() {
    this.server = startMirage()
  })

  afterEach(function() {
    this.server.shutdown()
  })

  it('renders', function() {
    this.render(hbs`
      {{#task-selection as |t|}}
        {{t.customer}}
        {{t.project}}
        {{t.task}}
      {{/task-selection}}
    `)

    expect(this.$('.customer-select [aria-disabled=true]')).to.have.length(0)
    expect(this.$('.project-select [aria-disabled=true]')).to.have.length(1)
    expect(this.$('.task-select [aria-disabled=true]')).to.have.length(1)
  })

  it('can set initial customer', function() {
    this.set('customer', CUSTOMER)

    this.render(hbs`
      {{#task-selection
        initial    = (hash
          customer = customer
        )
      as |t|}}
        {{t.customer}}
        {{t.project}}
        {{t.task}}
      {{/task-selection}}
    `)

    return wait().then(() => {
      expect(this.$('.customer-select [aria-disabled=true]')).to.have.length(0)
      expect(this.$('.project-select [aria-disabled=true]')).to.have.length(0)
      expect(this.$('.task-select [aria-disabled=true]')).to.have.length(1)

      expect(
        this.$('.customer-select .ember-power-select-selected-item')
          .text()
          .trim()
      ).to.equal(CUSTOMER.name)
    })
  })

  it('can set initial project', function() {
    this.set('project', PROJECT)

    this.render(hbs`
      {{#task-selection
        initial   = (hash
          project = project
        )
      as |t|}}
        {{t.customer}}
        {{t.project}}
        {{t.task}}
      {{/task-selection}}
    `)

    return wait().then(() => {
      expect(this.$('.customer-select [aria-disabled=true]')).to.have.length(0)
      expect(this.$('.project-select [aria-disabled=true]')).to.have.length(0)
      expect(this.$('.task-select [aria-disabled=true]')).to.have.length(0)

      expect(
        this.$('.customer-select .ember-power-select-selected-item')
          .text()
          .trim()
      ).to.equal(CUSTOMER.name)
      expect(
        this.$('.project-select .ember-power-select-selected-item')
          .text()
          .trim()
      ).to.equal(PROJECT.name)
    })
  })

  it('can set initial task', function() {
    this.set('task', TASK)

    this.render(hbs`
      {{#task-selection
        initial = (hash
          task  = task
        )
      as |t|}}
        {{t.customer}}
        {{t.project}}
        {{t.task}}
      {{/task-selection}}
    `)

    return wait().then(() => {
      expect(this.$('.customer-select [aria-disabled=true]')).to.have.length(0)
      expect(this.$('.project-select [aria-disabled=true]')).to.have.length(0)
      expect(this.$('.task-select [aria-disabled=true]')).to.have.length(0)

      expect(
        this.$('.customer-select .ember-power-select-selected-item')
          .text()
          .trim()
      ).to.equal(CUSTOMER.name)
      expect(
        this.$('.project-select .ember-power-select-selected-item')
          .text()
          .trim()
      ).to.equal(PROJECT.name)
      expect(
        this.$('.task-select .ember-power-select-selected-item')
          .text()
          .trim()
      ).to.equal(TASK.name)
    })
  })

  it('can clear customer', function() {
    this.set('task', TASK)

    this.render(hbs`
      {{#task-selection
        initial = (hash
          task  = task
        )
      as |t|}}
        {{t.customer}}
        {{t.project}}
        {{t.task}}
      {{/task-selection}}
    `)
  })

  it('can clear all filters', function() {
    this.set('task', TASK)

    this.render(hbs`
      {{#task-selection
        initial = (hash
          task  = task
        )
      as |t|}}
        {{t.customer}}
        {{t.project}}
        {{t.task}}
        <button {{action t.clear}}></button>
      {{/task-selection}}
    `)

    this.$('button').click()

    return wait().then(() => {
      expect(
        this.$('.customer-select .ember-power-select-selected-item')
      ).to.have.length(0)
      expect(
        this.$('.project-select .ember-power-select-selected-item')
      ).to.have.length(0)
      expect(
        this.$('.project-select .ember-power-select-selected-item')
      ).to.have.length(0)
    })
  })
})
