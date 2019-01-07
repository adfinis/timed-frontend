import { click, find, findAll, render } from '@ember/test-helpers'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'
import EmberObject from '@ember/object'

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
  let app = setupRenderingTest()
  setupMirage(app)

  it('renders', async function() {
    await render(hbs`
      {{#task-selection as |t|}}
        {{t.customer}}
        {{t.project}}
        {{t.task}}
      {{/task-selection}}
    `)

    expect(findAll('.customer-select [aria-disabled=true]')).to.have.length(0)
    expect(findAll('.project-select [aria-disabled=true]')).to.have.length(1)
    expect(findAll('.task-select [aria-disabled=true]')).to.have.length(1)
  })

  it('can set initial customer', async function() {
    this.set('customer', CUSTOMER)

    await render(hbs`
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

    expect(findAll('.customer-select [aria-disabled=true]')).to.have.length(0)
    expect(findAll('.project-select [aria-disabled=true]')).to.have.length(0)
    expect(findAll('.task-select [aria-disabled=true]')).to.have.length(1)

    expect(
      find(
        '.customer-select .ember-power-select-selected-item'
      ).textContent.trim()
    ).to.equal(CUSTOMER.name)
  })

  it('can set initial project', async function() {
    this.set('project', PROJECT)

    await render(hbs`
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

    expect(findAll('.customer-select [aria-disabled=true]')).to.have.length(0)
    expect(findAll('.project-select [aria-disabled=true]')).to.have.length(0)
    expect(findAll('.task-select [aria-disabled=true]')).to.have.length(0)

    expect(
      find(
        '.customer-select .ember-power-select-selected-item'
      ).textContent.trim()
    ).to.equal(CUSTOMER.name)
    expect(
      find(
        '.project-select .ember-power-select-selected-item'
      ).textContent.trim()
    ).to.equal(PROJECT.name)
  })

  it('can set initial task', async function() {
    this.set('task', TASK)

    await render(hbs`
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

    expect(findAll('.customer-select [aria-disabled=true]')).to.have.length(0)
    expect(findAll('.project-select [aria-disabled=true]')).to.have.length(0)
    expect(findAll('.task-select [aria-disabled=true]')).to.have.length(0)

    expect(
      find(
        '.customer-select .ember-power-select-selected-item'
      ).textContent.trim()
    ).to.equal(CUSTOMER.name)
    expect(
      find(
        '.project-select .ember-power-select-selected-item'
      ).textContent.trim()
    ).to.equal(PROJECT.name)
    expect(
      find('.task-select .ember-power-select-selected-item').textContent.trim()
    ).to.equal(TASK.name)
  })

  it('can clear customer', async function() {
    this.set('task', TASK)

    await render(hbs`
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

  it('can clear all filters', async function() {
    this.set('task', TASK)

    await render(hbs`
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

    await click('button')

    expect(
      findAll('.customer-select .ember-power-select-selected-item')
    ).to.have.length(0)
    expect(
      findAll('.project-select .ember-power-select-selected-item')
    ).to.have.length(0)
    expect(
      findAll('.project-select .ember-power-select-selected-item')
    ).to.have.length(0)
  })
})
