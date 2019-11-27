import { click, render } from '@ember/test-helpers'
import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'
import EmberObject from '@ember/object'
import moment from 'moment'

const ATTENDANCE = EmberObject.create({
  from: moment({ h: 8, m: 0, s: 0, ms: 0 }),
  to: moment({ h: 8, m: 0, s: 0, ms: 0 })
})

module('Integration | Component | attendance slider', function(hooks) {
  setupRenderingTest(hooks)

  test('renders', async function(assert) {
    this.set('attendance', ATTENDANCE)

    await render(hbs`
      {{attendance-slider attendance=attendance}}
    `)

    assert.dom('.noUi-connect').exists()
  })

  test('can delete', async function(assert) {
    this.set('attendance', ATTENDANCE)

    this.on('delete', attendance => {
      assert.ok(attendance)
    })

    await render(hbs`
      {{attendance-slider
        attendance = attendance
        on-delete  = (action 'delete')
      }}
    `)

    await click('.fa-trash')
  })

  test('can handle attendances until 00:00', async function(assert) {
    this.set(
      'attendance',
      EmberObject.create({
        from: moment({ h: 0, m: 0, s: 0 }),
        to: moment({ h: 0, m: 0, s: 0 })
      })
    )

    await render(hbs`
      {{attendance-slider attendance=attendance}}
    `)

    assert.dom('span').hasText('24:00')
  })
})
