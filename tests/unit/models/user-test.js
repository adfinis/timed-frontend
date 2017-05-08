import { describe, it }   from 'mocha'
import { setupModelTest } from 'ember-mocha'
import { expect }         from 'chai'
import moment             from 'moment'

describe('Unit | Model | user', function() {
  setupModelTest('user', {
    needs: [
      'model:employment',
      'model:location',
      'model:absence-credit'
    ]
  })

  it('exists', function() {
    let model = this.subject()

    expect(model).to.be.ok
  })

  it('computes a full name', function() {
    let model = this.subject({ firstName: 'Hans', lastName: 'Muster' })

    expect(model).to.be.ok

    expect(model.get('fullName')).to.equal('Hans Muster')
  })

  it('computes a long name with full name', function() {
    let model = this.subject({ username: 'hansm', firstName: 'Hans', lastName: 'Muster' })

    expect(model).to.be.ok

    expect(model.get('longName')).to.equal('Hans Muster (hansm)')
  })

  it('computes a long name without full name', function() {
    let model = this.subject({ username: 'hansm' })

    expect(model).to.be.ok

    expect(model.get('longName')).to.equal('hansm')
  })

  it('computes the active employment', function() {
    let model = this.subject({ username: 'hansm' })

    expect(model).to.be.ok

    expect(model.get('activeEmployment')).to.be.null

    model.set('employments', [
      this.store().createRecord('employment', { id: 1, to: null     }),
      this.store().createRecord('employment', { id: 2, to: moment() })
    ])

    expect(Number(model.get('activeEmployment.id'))).to.equal(1)
  })
})
