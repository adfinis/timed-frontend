import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import moment from 'moment'

describe('Integration | Component | weekly overview day', function() {
  setupComponentTest('weekly-overview-day', {
    integration: true
  })

  it('renders', function() {
    this.set('day', moment({ y: 2017, m: 4, d: 5 }))
    this.set('expected', moment.duration({ h: 8 }))
    this.set('worktime', moment.duration({ h: 8 }))

    this.render(
      hbs`{{weekly-overview-day day=day expected=expected worktime=worktime}}`
    )

    expect(this.$()).to.have.length(1)

    expect(this.$('.day').text().trim()).to.equal('05\n  Th')
  })

  it('computes a title', function() {
    this.set('day', moment({ y: 2017, m: 4, d: 5 }))
    this.set('expected', moment.duration({ h: 8, m: 30 }))
    this.set('worktime', moment.duration({ h: 8, m: 30 }))

    this.render(
      hbs`{{weekly-overview-day day=day expected=expected worktime=worktime prefix='Ferien'}}`
    )

    expect(this.$(':eq(0)').attr('title')).to.equal('Ferien, 8h 30m')
  })

  it('fires on-click action on click', function() {
    this.set('day', moment({ y: 2017, m: 4, d: 5 }))
    this.set('expected', moment.duration({ h: 8, m: 30 }))
    this.set('worktime', moment.duration({ h: 8, m: 30 }))
    this.set('clicked', false)

    this.render(
      hbs`{{weekly-overview-day day=day expected=expected worktime=worktime}}`
    )

    expect(this.get('clicked')).to.not.be.ok
    this.$('.bar').click()
    this.$('.day').click()
    expect(this.get('clicked')).to.not.be.ok

    this.render(
      hbs`{{weekly-overview-day day=day expected=expected worktime=worktime on-click=(action (mut clicked) true)}}`
    )

    expect(this.get('clicked')).to.not.be.ok

    this.$('.bar').click()

    expect(this.get('clicked')).to.be.ok

    this.set('clicked', false)

    expect(this.get('clicked')).to.not.be.ok

    this.$('.day').click()

    expect(this.get('clicked')).to.be.ok
  })
})
