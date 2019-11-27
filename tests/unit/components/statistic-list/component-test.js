import { module, test } from 'qunit'
import EmberObject from '@ember/object'
import moment from 'moment'
import { setupRenderingTest } from 'ember-qunit'

module('Unit | Component | statistic list', function(hooks) {
  setupRenderingTest(hooks)

  test('calculates max duration', function(assert) {
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

    assert.equal(component.get('maxDuration').hours(), 15)
  })

  test('parses total', function(assert) {
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

    assert.equal(component.get('total').asHours(), 34.5)
  })

  test('computes columns', function(assert) {
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

      assert.deepEqual(component.get('columns').mapBy('title'), expected[type])
    })
  })

  test('computes correct missing params message', function(assert) {
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

      assert.equal(component.get('missingParamsMessage'), text)
    })
  })
})
