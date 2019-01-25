import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'
import EmberObject from '@ember/object'
import { startMirage } from 'timed/initializers/ember-cli-mirage'

describe('Unit | Controller | index/activities', function() {
  setupTest('controller:index/activities', {
    // Specify the other units that are required for this test.
    needs: ['model:activity']
  })

  // Replace this with your real tests.
  it('exists', function() {
    let controller = this.subject()
    expect(controller).to.be.ok
  })

  it('ammends activities', function() {
    this.set(
      'model',
      EmberObject.create({
        id: 1,
        estimatedTime: moment.duration({ h: 50 }),
        constructor: EmberObject.create({
          modelName: 'project'
        })
      })
    )

    let controller = this.subject()
    expect(controller.get('mergedActivities')).to.be.an.instanceOf(Array)
    expect(controller.get('mergedActivities')).to.have.lengthOf(3)
  })
})
