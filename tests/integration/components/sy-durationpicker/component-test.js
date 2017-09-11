import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import moment from 'moment'
import $ from 'jquery'

const event = $.Event

describe('Integration | Component | sy durationpicker', function() {
  setupComponentTest('sy-durationpicker', {
    integration: true
  })

  it('renders', function() {
    this.set('value', moment.duration({ h: 1, m: 30 }))

    this.render(hbs`{{sy-durationpicker value=value}}`)

    expect(this.$('input').val()).to.equal('01:30')
  })

  it('renders without value', function() {
    this.set('value', null)

    this.render(hbs`{{sy-durationpicker value=value}}`)

    expect(this.$('input').val()).to.equal('')
  })

  it('can change the value', function() {
    this.set(
      'value',
      moment.duration({
        h: 12,
        m: 30
      })
    )

    this.render(
      hbs`{{sy-durationpicker value=value on-change=(action (mut value))}}`
    )

    this.$('input')
      .val('13:15')
      .change()

    expect(this.get('value').hours()).to.equal(13)
    expect(this.get('value').minutes()).to.equal(15)
  })

  it("can't set an invalid value", function() {
    this.set(
      'value',
      moment.duration({
        h: 12,
        m: 30
      })
    )

    this.render(
      hbs`{{sy-durationpicker value=value on-change=(action (mut value))}}`
    )

    this.$('input')
      .val('24:15')
      .change()

    expect(this.get('value').hours()).to.equal(12)
    expect(this.get('value').minutes()).to.equal(30)
  })

  it('can increase minutes per arrow', function() {
    this.set(
      'value',
      moment.duration({
        h: 12,
        m: 15
      })
    )

    this.render(
      hbs`{{sy-durationpicker value=value on-change=(action (mut value))}}`
    )

    this.$('input').trigger(event('keydown', { key: 'ArrowUp', keyCode: 38 }))

    expect(this.get('value').hours()).to.equal(12)
    expect(this.get('value').minutes()).to.equal(30)
  })

  it('can decrease minutes per arrow', function() {
    this.set(
      'value',
      moment.duration({
        h: 12,
        m: 15
      })
    )

    this.render(
      hbs`{{sy-durationpicker value=value on-change=(action (mut value))}}`
    )

    this.$('input').trigger(event('keydown', { key: 'ArrowDown', keyCode: 40 }))

    expect(this.get('value').hours()).to.equal(12)
    expect(this.get('value').minutes()).to.equal(0)
  })

  it("can't be bigger than max or smaller than min", function() {
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

    this.render(
      hbs`{{sy-durationpicker min=min max=max value=value on-change=(action (mut value))}}`
    )

    this.$('input').trigger(event('keydown', { key: 'ArrowUp', keyCode: 38 }))

    expect(this.get('value').hours()).to.equal(12)
    expect(this.get('value').minutes()).to.equal(30)

    this.$('input').trigger(event('keydown', { key: 'ArrowDown', keyCode: 40 }))

    expect(this.get('value').hours()).to.equal(12)
    expect(this.get('value').minutes()).to.equal(30)
  })
})
