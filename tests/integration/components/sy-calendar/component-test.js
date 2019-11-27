import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'
import moment from 'moment'
import wait from 'ember-test-helpers/wait'
import { find, triggerEvent, render } from '@ember/test-helpers'

module('Integration | Component | sy calendar', function(hooks) {
  setupRenderingTest(hooks)

  test('can select a year', async function(assert) {
    this.set('center', moment({ y: 2017, m: 10, d: 7 }))

    await render(
      hbs`{{sy-calendar center=center onCenterChange=(action (mut center) value='moment')}}`
    )

    let sel = find('.nav-select-year select')

    sel.value = '2010'

    await triggerEvent(sel, 'change')

    return wait().then(() => {
      assert.equals(this.get('center').year(), 2010)
    })
  })

  test('can select a month', async function(assert) {
    this.set('center', moment({ y: 2017, m: 10, d: 7 }))

    await render(
      hbs`{{sy-calendar center=center onCenterChange=(action (mut center) value='moment')}}`
    )

    let sel = find('.nav-select-month select')

    sel.value = 'May'

    await triggerEvent(sel, 'change')

    return wait().then(() => {
      assert.equals(this.get('center').month(), 4)
    })
  })
})
