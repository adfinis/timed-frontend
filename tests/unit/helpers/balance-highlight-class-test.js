import { expect }                from 'chai'
import { describe, it }          from 'mocha'
import { balanceHighlightClass } from 'timed/helpers/balance-highlight-class'

describe('Unit | Helper | balance highlight class', function() {
  it('returns an empty string on neutral durations', function() {
    let result = balanceHighlightClass([ moment.duration({ h: 0, m: 0 }) ])

    expect(result).to.equal('')
  })

  it('returns `color-success` on positive durations', function() {
    let result = balanceHighlightClass([ moment.duration({ h: 1, m: 30 }) ])

    expect(result).to.equal('color-success')
  })

  it('returns `color-danger` on negative durations', function() {
    let result = balanceHighlightClass([ moment.duration({ h: -1, m: 30 }) ])

    expect(result).to.equal('color-danger')
  })
})

