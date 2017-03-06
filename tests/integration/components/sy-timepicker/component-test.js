import { expect }             from 'chai'
import { describe, it }       from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs                    from 'htmlbars-inline-precompile'
import moment                 from 'moment'
import { clickTrigger }       from 'timed/tests/helpers/ember-basic-dropdown'
import testSelector           from 'ember-test-selectors'

describe('Integration | Component | sy timepicker', function() {
  setupComponentTest('sy-timepicker', {
    integration: true
  })

  it('renders', function() {
    this.set('value', moment())

    this.render(hbs`{{sy-timepicker value=value}}`)

    expect(this.$('input').val()).to.equal(moment().format('HH:mm'))
  })

  it('toggles the timepicker on click of the input', function() {
    this.set('value', moment())

    this.render(hbs`{{sy-timepicker value=value}}`)

    expect(this.$('.sy-timepicker-picker')).to.have.length(0)

    clickTrigger()

    expect(this.$('.sy-timepicker-picker')).to.have.length(1)
  })

  it('can change hours', function() {
    this.set('value', moment({
      h: 12,
      m: 30
    }))

    this.render(hbs`{{sy-timepicker value=value on-change=(action (mut value))}}`)

    expect(this.$('.sy-timepicker-picker')).to.have.length(0)

    clickTrigger()

    this.$(testSelector('sy-timepicker-inc-h')).click()

    expect(this.get('value').hour()).to.equal(13)

    this.$(testSelector('sy-timepicker-dec-h')).click()

    expect(this.get('value').hour()).to.equal(12)
  })

  it('can change minutes', function() {
    this.set('value', moment({
      h: 12,
      m: 30
    }))

    this.render(hbs`{{sy-timepicker value=value on-change=(action (mut value))}}`)

    expect(this.$('.sy-timepicker-picker')).to.have.length(0)

    clickTrigger()

    this.$(testSelector('sy-timepicker-inc-m')).click()

    expect(this.get('value').minute()).to.equal(45)

    this.$(testSelector('sy-timepicker-dec-m')).click()

    expect(this.get('value').minute()).to.equal(30)

    this.$(testSelector('sy-timepicker-dec-m')).click()
    this.$(testSelector('sy-timepicker-dec-m')).click()

    expect(this.get('value').hour()).to.equal(12)
    expect(this.get('value').minute()).to.equal(0)

    this.$(testSelector('sy-timepicker-dec-m')).click()

    expect(this.get('value').hour()).to.equal(11)
    expect(this.get('value').minute()).to.equal(45)

    this.$(testSelector('sy-timepicker-inc-m')).click()

    expect(this.get('value').hour()).to.equal(12)
    expect(this.get('value').minute()).to.equal(0)
  })
})
