import { expect }             from 'chai'
import { describe, it }       from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs                    from 'htmlbars-inline-precompile'
import moment                 from 'moment'

describe('Integration | Component | duration since', function() {
  setupComponentTest('duration-since', {
    integration: true
  })

  it('computes the duration correctly', function() {
    this.set('start', moment().subtract({
      minutes: 5,
      seconds: 5
    }))

    this.render(hbs`{{duration-since start}}`)

    expect(this.$()).to.have.length(1)
    expect(this.$().text().trim()).to.equal('00:05:05')
  })

  it('computes the duration correctly with elapsed time', function() {
    this.set('start', moment().subtract({
      minutes: 5,
      seconds: 5
    }))

    this.set('elapsed', moment.duration({
      hours: 1,
      minutes: 1,
      seconds: 1
    }))

    this.render(hbs`{{duration-since start elapsed=elapsed}}`)

    expect(this.$()).to.have.length(1)
    expect(this.$().text().trim()).to.equal('01:06:06')
  })
})
