import { click, render } from '@ember/test-helpers'
import { module, test } from 'qunit'
import hbs from 'htmlbars-inline-precompile'
import { startMirage } from 'timed/initializers/ember-cli-mirage'
import EmberObject from '@ember/object'
import wait from 'ember-test-helpers/wait'
import { setupRenderingTest } from 'ember-qunit'

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

module('Integration | Component | task selection', function(hooks) {
  setupRenderingTest(hooks)

  hooks.beforeEach(function() {
    this.server = startMirage()
  })

  hooks.afterEach(function() {
    this.server.shutdown()
  })

  test('renders', async function(assert) {
    await render(hbs`
      {{#task-selection as |t|}}
        {{t.customer}}
        {{t.project}}
        {{t.task}}
      {{/task-selection}}
    `)

    assert.dom('.customer-select [aria-disabled=true]').doesNotExist()
    assert.dom('.project-select [aria-disabled=true]').exists()
    assert.dom('.task-select [aria-disabled=true]').exists()
  })

  test('can set initial customer', async function(assert) {
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

    return wait().then(() => {
      assert.dom('.customer-select [aria-disabled=true]').doesNotExist()
      assert.dom('.project-select [aria-disabled=true]').doesNotExist()
      assert.dom('.task-select [aria-disabled=true]').exists()

      assert.equal(
        this.$('.customer-select .ember-power-select-selected-item')
          .text()
          .trim(),
        CUSTOMER.name
      )
    })
  })

  test('can set initial project', async function(assert) {
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

    return wait().then(() => {
      assert.dom('.customer-select [aria-disabled=true]').doesNotExist()
      assert.dom('.project-select [aria-disabled=true]').doesNotExist()
      assert.dom('.task-select [aria-disabled=true]').doesNotExist()

      assert.equal(
        this.$('.customer-select .ember-power-select-selected-item')
          .text()
          .trim(),
        CUSTOMER.name
      )
      assert.equal(
        this.$('.project-select .ember-power-select-selected-item')
          .text()
          .trim(),
        PROJECT.name
      )
    })
  })

  test('can set initial task', async function(assert) {
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

    return wait().then(() => {
      assert.dom('.customer-select [aria-disabled=true]').doesNotExist()
      assert.dom('.project-select [aria-disabled=true]').doesNotExist()
      assert.dom('.task-select [aria-disabled=true]').doesNotExist()

      assert.equal(
        this.$('.customer-select .ember-power-select-selected-item')
          .text()
          .trim(),
        CUSTOMER.name
      )
      assert.equal(
        this.$('.project-select .ember-power-select-selected-item')
          .text()
          .trim(),
        PROJECT.name
      )
      assert.equal(
        this.$('.task-select .ember-power-select-selected-item')
          .text()
          .trim(),
        TASK.name
      )
    })
  })

  test('can clear customer', async function(assert) {
    assert.expect(0)

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

  test('can clear all filters', async function(assert) {
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

    return wait().then(() => {
      assert
        .dom('.customer-select .ember-power-select-selected-item')
        .doesNotExist()
      assert
        .dom('.project-select .ember-power-select-selected-item')
        .doesNotExist()
      assert
        .dom('.task-select .ember-power-select-selected-item')
        .doesNotExist()
    })
  })
})
