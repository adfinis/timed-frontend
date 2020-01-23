import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'
import moment from 'moment'
import wait from 'ember-test-helpers/wait'
import { fillIn, render } from '@ember/test-helpers'

module('Integration | Component | sy calendar', function(hooks) {
  setupRenderingTest(hooks)

  test('can select a year', async function(assert) {
    this.set('center', moment({ y: 2017, m: 10, d: 7 }))

    await render(hbs`
      {{sy-calendar
        publicAPI=(hash center=center)
        onCenterChange=(action (mut center) value='moment')
      }}
    `)

    await fillIn('.nav-select-year select', '2010')

    return wait().then(() => {
      assert.equal(this.get('center').year(), 2010)
    })
  })

  test('can select a month', async function(assert) {
    this.set('center', moment({ y: 2017, m: 10, d: 7 }))

    await render(hbs`
      {{sy-calendar
        publicAPI=(hash center=center)
        onCenterChange=(action (mut center) value='moment')
      }}
    `)

    await fillIn('.nav-select-month select', 'May')

    return wait().then(() => {
      assert.equal(this.get('center').month(), 4)
    })
  })
})
