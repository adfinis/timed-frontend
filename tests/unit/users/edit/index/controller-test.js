import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Controller | users/edit/index', function() {
  setupTest('controller:users/edit/index', {
    // Specify the other units that are required for this test.
    needs: ['model:absence']
  })

  // Replace this with your real tests.
  it('exists', function() {
    let controller = this.subject()
    expect(controller).to.be.ok
  })

  it('can show more or less absences', function() {
    let controller = this.subject()

    expect(controller.get('absenceLimit')).to.equal(5)

    controller.send('toggleAbsenceLimit')

    expect(controller.get('absenceLimit')).to.be.null

    controller.send('toggleAbsenceLimit')

    expect(controller.get('absenceLimit')).to.equal(5)
  })
})
