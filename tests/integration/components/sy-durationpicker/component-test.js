import { fillIn, blur, render } from '@ember/test-helpers'
import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'
import moment from 'moment'
import $ from 'jquery'
import formatDuration from 'timed/utils/format-duration'

const event = $.Event

module('Integration | Component | sy durationpicker', function(hooks) {
  setupRenderingTest(hooks)

  test('renders', async function(assert) {
    this.set('value', moment.duration({ h: 1, m: 30 }))

    await render(hbs`{{sy-durationpicker value=value}}`)

    assert.dom('input').hasText('01:30')
  })

  test('renders without value', async function(assert) {
    this.set('value', null)

    await render(hbs`{{sy-durationpicker value=value}}`)

    assert.dom('input').hasNoText()
  })

  test('can change the value', async function(assert) {
    this.set(
      'value',
      moment.duration({
        h: 12,
        m: 30
      })
    )

    await render(
      hbs`{{sy-durationpicker value=value on-change=(action (mut value))}}`
    )

    await fillIn('input', '13:15')
    await blur('input')

    assert.equal(this.get('value').hours(), 13)
    assert.equal(this.get('value').minutes(), 15)
  })

  test('can set a negative value', async function(assert) {
    this.set(
      'value',
      moment.duration({
        h: 12,
        m: 30
      })
    )

    await render(
      hbs`{{sy-durationpicker value=value on-change=(action (mut value))}}`
    )

    await fillIn('input', '-13:00')
    await blur('input')

    assert.equal(this.get('value').hours(), -13)
  })

  test("can't set an invalid value", async function(assert) {
    this.set(
      'value',
      moment.duration({
        h: 12,
        m: 30
      })
    )

    await render(
      hbs`{{sy-durationpicker value=value on-change=(action (mut value))}}`
    )

    await fillIn('input', 'abcdef')
    await blur('input')

    assert.equal(this.get('value').hours(), 12)
    assert.equal(this.get('value').minutes(), 30)
  })

  test('can increase minutes per arrow', async function(assert) {
    this.set(
      'value',
      moment.duration({
        h: 12,
        m: 15
      })
    )

    await render(
      hbs`{{sy-durationpicker value=value on-change=(action (mut value))}}`
    )

    this.$('input').trigger(event('keydown', { key: 'ArrowUp', keyCode: 38 }))

    assert.equal(this.get('value').hours(), 12)
    assert.equal(this.get('value').minutes(), 30)
  })

  test('can decrease minutes per arrow', async function(assert) {
    this.set(
      'value',
      moment.duration({
        h: 12,
        m: 15
      })
    )

    await render(
      hbs`{{sy-durationpicker value=value on-change=(action (mut value))}}`
    )

    this.$('input').trigger(event('keydown', { key: 'ArrowDown', keyCode: 40 }))

    assert.equal(this.get('value').hours(), 12)
    assert.equal(this.get('value').minutes(), 0)
  })

  test("can't be bigger than max or smaller than min", async function(assert) {
    this.set(
      'value',
      moment.duration({
        h: 12,
        m: 30
      })
    )

    this.set(
      'min',
      moment.duration({
        h: 12,
        m: 30
      })
    )

    this.set(
      'max',
      moment.duration({
        h: 12,
        m: 30
      })
    )

    await render(
      hbs`{{sy-durationpicker min=min max=max value=value on-change=(action (mut value))}}`
    )

    this.$('input').trigger(event('keydown', { key: 'ArrowUp', keyCode: 38 }))

    assert.equal(this.get('value').hours(), 12)
    assert.equal(this.get('value').minutes(), 30)

    this.$('input').trigger(event('keydown', { key: 'ArrowDown', keyCode: 40 }))

    assert.equal(this.get('value').hours(), 12)
    assert.equal(this.get('value').minutes(), 30)
  })

  test('can set a negative value with minutes', async function(assert) {
    this.set('value', null)

    await render(
      hbs`{{sy-durationpicker value=value on-change=(action (mut value))}}`
    )

    await fillIn('input', '-04:30')
    await blur('input')

    assert.equal(this.get('value').hours(), -4)
    assert.equal(this.get('value').minutes(), -30)

    assert.equal(formatDuration(this.get('value'), false), '-04:30')
  })
})
