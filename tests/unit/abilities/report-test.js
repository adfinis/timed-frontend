import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Ability | report', function(hooks) {
  setupTest(hooks)

  test('can edit when user is superuser', function(assert) {
    let ability = this.subject({ user: { isSuperuser: true } })

    assert.equal(ability.get('canEdit'), true)
  })

  test('can edit when user is superuser and report is verified', function(
    assert
  ) {
    let ability = this.subject({
      user: { isSuperuser: true },
      model: { verifiedBy: { id: 1 } }
    })

    assert.equal(ability.get('canEdit'), true)
  })

  test('can edit when user owns report', function(assert) {
    let ability = this.subject({
      user: { id: 1 },
      model: { user: { id: 1 } }
    })

    assert.equal(ability.get('canEdit'), true)
  })

  test('can edit when user is supervisor of owner', function(assert) {
    let ability = this.subject({
      user: { id: 1 },
      model: { user: { supervisors: [{ id: 1 }] } }
    })

    assert.equal(ability.get('canEdit'), true)
  })

  test('can edit when user reviewer of project', function(assert) {
    let ability = this.subject({
      user: { id: 1 },
      model: { task: { project: { reviewers: [{ id: 1 }] } } }
    })

    assert.equal(ability.get('canEdit'), true)
  })

  test('can not edit when not allowed', function(assert) {
    let ability = this.subject({
      user: { id: 1, isSuperuser: false },
      model: {
        user: { id: 2, supervisors: [{ id: 2 }] },
        task: { project: { reviewers: [{ id: 2 }] } }
      }
    })

    assert.equal(ability.get('canEdit'), false)
  })

  test('can not edit when report is verified', function(assert) {
    let ability = this.subject({
      user: { id: 1, isSuperuser: false },
      model: {
        user: { id: 1, supervisors: [{ id: 1 }] },
        task: { project: { reviewers: [{ id: 1 }] } },
        verifiedBy: { id: 1 }
      }
    })

    assert.equal(ability.get('canEdit'), false)
  })
})
