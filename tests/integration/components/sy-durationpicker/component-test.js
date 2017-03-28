import { expect }             from 'chai'
import { describe, it }       from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs                    from 'htmlbars-inline-precompile'
import moment                 from 'moment'
import { clickTrigger }       from 'timed/tests/helpers/ember-basic-dropdown'
import testSelector           from 'ember-test-selectors'

describe('Integration | Component | sy durationpicker', function() {
  setupComponentTest('sy-durationpicker', {
    integration: true
  })

  it('renders', function() {
    this.set('value', moment.duration({ h: 1, m: 30 }))

    this.render(hbs`{{sy-durationpicker value=value}}`)

    expect(this.$('input').val()).to.equal('01:30')
  })

  it('toggles the durationpicker on click of the input', function() {
    this.set('value', moment.duration({ h: 1, m: 30 }))

    this.render(hbs`{{sy-durationpicker value=value}}`)

    expect(this.$('.sy-durationpicker-picker')).to.have.length(0)

    clickTrigger()

    expect(this.$('.sy-durationpicker-picker')).to.have.length(1)
  })

  it('can change hours', function() {
    this.set('value', moment.duration({ h: 1, m: 30 }))

    this.render(hbs`{{sy-durationpicker value=value on-change=(action (mut value))}}`)

    expect(this.$('.sy-durationpicker-picker')).to.have.length(0)

    clickTrigger()

    this.$(testSelector('sy-durationpicker-inc-h')).click()

    expect(this.$('input').val()).to.equal('02:30')

    this.$(testSelector('sy-durationpicker-dec-h')).click()

    expect(this.$('input').val()).to.equal('01:30')
  })

  it('can change minutes', function() {
    this.set('value', moment.duration({ h: 1, m: 30 }))

    this.render(hbs`{{sy-durationpicker value=value on-change=(action (mut value))}}`)

    expect(this.$('.sy-durationpicker-picker')).to.have.length(0)

    clickTrigger()

    this.$(testSelector('sy-durationpicker-inc-m')).click()

    expect(this.$('input').val()).to.equal('01:45')

    this.$(testSelector('sy-durationpicker-dec-m')).click()

    expect(this.$('input').val()).to.equal('01:30')

    this.$(testSelector('sy-durationpicker-dec-m')).click()
    this.$(testSelector('sy-durationpicker-dec-m')).click()

    expect(this.$('input').val()).to.equal('01:00')

    this.$(testSelector('sy-durationpicker-dec-m')).click()

    expect(this.$('input').val()).to.equal('00:45')

    this.$(testSelector('sy-durationpicker-inc-m')).click()

    expect(this.$('input').val()).to.equal('01:00')
  })

  it('can not be more than 24 hours', function() {
    this.set('value', moment.duration({ h: 23, m: 45 }))

    this.render(hbs`{{sy-durationpicker value=value on-change=(action (mut value))}}`)

    expect(this.$('.sy-durationpicker-picker')).to.have.length(0)

    clickTrigger()

    expect(this.$('input').val()).to.equal('23:45')

    this.$(testSelector('sy-durationpicker-inc-h')).click()

    expect(this.$('input').val()).to.equal('23:45')

    this.$(testSelector('sy-durationpicker-inc-m')).click()

    expect(this.$('input').val()).to.equal('23:45')
  })

  it('can not be less than 0 hours', function() {
    this.set('value', moment.duration({ h: 0, m: 0 }))

    this.render(hbs`{{sy-durationpicker value=value on-change=(action (mut value))}}`)

    expect(this.$('.sy-durationpicker-picker')).to.have.length(0)

    clickTrigger()

    expect(this.$('input').val()).to.equal('00:00')

    this.$(testSelector('sy-durationpicker-dec-h')).click()

    expect(this.$('input').val()).to.equal('00:00')

    this.$(testSelector('sy-durationpicker-dec-m')).click()

    expect(this.$('input').val()).to.equal('00:00')
  })
})
