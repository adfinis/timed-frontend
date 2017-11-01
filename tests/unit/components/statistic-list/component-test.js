import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import EmberObject from '@ember/object'
import moment from 'moment'

describe('Unit | Component | statistic list', function() {
  setupComponentTest('statistic-list', {
    // Specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar'],
    unit: true
  })

  it('calculates max duration', function() {
    let component = this.subject({
      data: {
        last: {
          value: [
            { duration: moment.duration({ h: 3 }) },
            { duration: moment.duration({ h: 5 }) },
            { duration: moment.duration({ h: 15 }) }
          ]
        }
      }
    })

    expect(component.get('maxDuration').hours()).to.equal(15)
  })

  it('parses total', function() {
    let component = this.subject({
      data: {
        last: {
          value: EmberObject.create({
            meta: {
              'total-time': '1 10:30:00'
            }
          })
        }
      }
    })

    expect(component.get('total').asHours()).to.equal(34.5)
  })

  it('computes columns', function() {
    let expected = {
      year: ['Year', 'Duration'],
      month: ['Year', 'Month', 'Duration'],
      customer: ['Customer', 'Duration'],
      project: ['Customer', 'Project', 'Estimated', 'Duration'],
      task: ['Customer', 'Project', 'Task', 'Estimated', 'Duration'],
      user: ['User', 'Duration']
    }

    let component = this.subject()

    Object.keys(expected).forEach(type => {
      component.set('type', type)

      expect(component.get('columns').mapBy('title')).to.deep.equal(
        expected[type]
      )
    })
  })

  it('computes correct missing params message', function() {
    let expected = [
      { params: [], text: '' },
      {
        params: ['test'],
        text: 'Test is a required parameter for this statistic'
      },
      {
        params: ['test1', 'test2'],
        text: 'Test1 and test2 are required parameters for this statistic'
      },
      {
        params: ['test1', 'test2', 'test3'],
        text:
          'Test1, test2 and test3 are required parameters for this statistic'
      }
    ]

    let component = this.subject()

    expected.forEach(({ params, text }) => {
      component.set('missingParams', params)

      expect(component.get('missingParamsMessage')).to.equal(text)
    })
  })
})
