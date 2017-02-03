import { describe, it }       from 'mocha'
import { expect }             from 'chai'
import { setupComponentTest } from 'ember-mocha'
import moment                 from 'moment'
import EmberObject            from 'ember-object'

const ATTENDANCE = EmberObject.create({
  from: moment({ h: 8, m: 0, s: 0, ms: 0 }),
  to: moment({ h: 8, m: 0, s: 0, ms: 0 })
})

describe('Unit | Component | attendance slider', function() {
  setupComponentTest('attendance-slider', {
    // specify the other units that are required for this test
    unit: true,
    needs: [
      'component:range-slider',
      'component:fa-icon'
    ]
  })

  it('renders', function() {
    let component = this.subject({ attendance: ATTENDANCE })
    expect(component._state).to.equal('preRender')

    this.render()
    expect(component._state).to.equal('inDOM')
  })

  it('updates values on slide', function() {
    let component = this.subject({ attendance: ATTENDANCE })

    component.get('actions.slide').apply(component, [ [ 0, 60 ] ])

    expect(component.get('values')).to.deep.equal([ 0, 60 ])
    expect(component.get('duration')).to.equal('01:00')
  })

  it('can save', function() {
    let component = this.subject({ attendance: ATTENDANCE })

    component.set('attrs', { 'on-save'({ from, to }) {
      expect(from.format('HH:mm')).to.equal('00:00')
      expect(to.format('HH:mm')).to.equal('01:45')
    } })

    component.get('actions.save').apply(component, [ [ 0, 105 ] ])
  })

  it('throws errors if actions are missing', function() {
    let component = this.subject({ attendance: ATTENDANCE })
    this.render()

    let deleteFn = () => {
      component.get('actions.delete').apply(component)
    }

    let saveFn = () => {
      component.get('actions.save').apply(component, [ [ 0, 0 ] ])
    }

    expect(deleteFn).to.throw(/action is missing/)
    expect(saveFn).to.throw(/action is missing/)
  })
})
