import { blur, fillIn, find, render } from '@ember/test-helpers'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import moment from 'moment'
import $ from 'jquery'
import formatDuration from 'timed/utils/format-duration'

const event = $.Event

describe('Integration | Component | sy durationpicker', function() {
  setupRenderingTest()

  it('renders', async function() {
    this.set('value', moment.duration({ h: 1, m: 30 }))

    await render(hbs`{{sy-durationpicker value=value}}`)

    expect(find('input').value).to.equal('01:30')
  })

  it('renders without value', async function() {
    this.set('value', null)

    await render(hbs`{{sy-durationpicker value=value}}`)

    expect(find('input').value).to.equal('')
  })

  it('can change the value', async function() {
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

    expect(this.get('value').hours()).to.equal(13)
    expect(this.get('value').minutes()).to.equal(15)
  })

  it('can set a negative value', async function() {
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

    expect(this.get('value').hours()).to.equal(-13)
  })

  it("can't set an invalid value", async function() {
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

    expect(this.get('value').hours()).to.equal(12)
    expect(this.get('value').minutes()).to.equal(30)
  })

  it('can increase minutes per arrow', async function() {
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

    expect(this.get('value').hours()).to.equal(12)
    expect(this.get('value').minutes()).to.equal(30)
  })

  it('can decrease minutes per arrow', async function() {
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

    expect(this.get('value').hours()).to.equal(12)
    expect(this.get('value').minutes()).to.equal(0)
  })

  it("can't be bigger than max or smaller than min", async function() {
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

    expect(this.get('value').hours()).to.equal(12)
    expect(this.get('value').minutes()).to.equal(30)

    this.$('input').trigger(event('keydown', { key: 'ArrowDown', keyCode: 40 }))

    expect(this.get('value').hours()).to.equal(12)
    expect(this.get('value').minutes()).to.equal(30)
  })

  it('can set a negative value with minutes', async function() {
    this.set('value', null)

    await render(
      hbs`{{sy-durationpicker value=value on-change=(action (mut value))}}`
    )

    await fillIn('input', '-04:30')
    await blur('input')

    expect(this.get('value').hours()).to.equal(-4)
    expect(this.get('value').minutes()).to.equal(-30)

    expect(formatDuration(this.get('value'), false)).to.equal('-04:30')
  })
})
