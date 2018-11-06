import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'
import moment from 'moment'
import wait from 'ember-test-helpers/wait'
import { find, triggerEvent } from 'ember-native-dom-helpers'

describe('Integration | Component | sy calendar', function() {
  setupRenderingTest()

  it('can select a year', async function() {
    this.set('center', moment({ y: 2017, m: 10, d: 7 }))

    await render(
      hbs`{{sy-calendar center=center onCenterChange=(action (mut center) value='moment')}}`
    )

    let sel = find('.nav-select-year select')

    sel.value = '2010'

    triggerEvent(sel, 'change')

    return wait().then(() => {
      expect(this.get('center').year()).to.equal(2010)
    })
  })

  it('can select a month', async function() {
    this.set('center', moment({ y: 2017, m: 10, d: 7 }))

    await render(
      hbs`{{sy-calendar center=center onCenterChange=(action (mut center) value='moment')}}`
    )

    let sel = find('.nav-select-month select')

    sel.value = 'May'

    triggerEvent(sel, 'change')

    return wait().then(() => {
      expect(this.get('center').month()).to.equal(4)
    })
  })
})
