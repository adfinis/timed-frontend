import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'
import { expect } from 'chai'

describe('Unit | Transform | django workdays', function() {
  setupTest(
    'transform:django-workdays',
    {
      // Specify the other units that are required for this test.
      // needs: ['transform:foo']
    }
  )

  it('serializes', function() {
    let transform = this.subject()

    let result = transform.serialize([1, 2, 3, 4, 5])

    expect(result).to.deep.equal(['1', '2', '3', '4', '5'])
  })

  it('deserializes', function() {
    let transform = this.subject()

    let result = transform.deserialize(['1', '2', '3', '4', '5'])

    expect(result).to.deep.equal([1, 2, 3, 4, 5])
  })
})
