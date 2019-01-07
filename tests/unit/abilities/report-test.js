import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'

describe('Unit | Ability | report', function() {
  setupTest()

  it('can edit when user is superuser', function() {
    let ability = this.owner.lookup('ability:report')
    ability.setProperties({ user: { isSuperuser: true } })

    expect(ability.get('canEdit')).to.be.true
  })

  it('can edit when user is superuser and report is verified', function() {
    let ability = this.owner.lookup('ability:report')
    ability.setProperties({
      user: { isSuperuser: true },
      model: { verifiedBy: { id: 1 } }
    })

    expect(ability.get('canEdit')).to.be.true
  })

  it('can edit when user owns report', function() {
    let ability = this.owner.lookup('ability:report')
    ability.setProperties({
      user: { id: 1 },
      model: { user: { id: 1 } }
    })

    expect(ability.get('canEdit')).to.be.true
  })

  it('can edit when user is supervisor of owner', function() {
    let ability = this.owner.lookup('ability:report')
    ability.setProperties({
      user: { id: 1 },
      model: { user: { supervisors: [{ id: 1 }] } }
    })

    expect(ability.get('canEdit')).to.be.true
  })

  it('can edit when user reviewer of project', function() {
    let ability = this.owner.lookup('ability:report')
    ability.setProperties({
      user: { id: 1 },
      model: { task: { project: { reviewers: [{ id: 1 }] } } }
    })

    expect(ability.get('canEdit')).to.be.true
  })

  it('can not edit when not allowed', function() {
    let ability = this.owner.lookup('ability:report')
    ability.setProperties({
      user: { id: 1, isSuperuser: false },
      model: {
        user: { id: 2, supervisors: [{ id: 2 }] },
        task: { project: { reviewers: [{ id: 2 }] } }
      }
    })

    expect(ability.get('canEdit')).to.be.false
  })

  it('can not edit when report is verified', function() {
    let ability = this.owner.lookup('ability:report')
    ability.setProperties({
      user: { id: 1, isSuperuser: false },
      model: {
        user: { id: 1, supervisors: [{ id: 1 }] },
        task: { project: { reviewers: [{ id: 1 }] } },
        verifiedBy: { id: 1 }
      }
    })

    expect(ability.get('canEdit')).to.be.false
  })
})
