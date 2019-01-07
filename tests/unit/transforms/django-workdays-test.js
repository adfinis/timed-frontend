import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'
import { expect } from 'chai'

describe('Unit | Transform | django workdays', function() {
  setupTest()

  it('serializes', function() {
    let transform = this.owner.lookup('transform:django-workdays')

    let result = transform.serialize([1, 2, 3, 4, 5])

    expect(result).to.deep.equal(['1', '2', '3', '4', '5'])
  })

  it('deserializes', function() {
    let transform = this.owner.lookup('transform:django-workdays')

    let result = transform.deserialize(['1', '2', '3', '4', '5'])

    expect(result).to.deep.equal([1, 2, 3, 4, 5])
  })
})
