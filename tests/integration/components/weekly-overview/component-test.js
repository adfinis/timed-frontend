import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'
import moment from 'moment'
import { render } from '@ember/test-helpers'

module('Integration | Component | weekly overview', function(hooks) {
  setupRenderingTest(hooks)

  test('renders', async function(assert) {
    this.set('expected', moment.duration({ h: 8 }))

    await render(hbs`{{weekly-overview expected=expected}}`)

    assert.length(this.$(), 1)
  })

  test('renders the benchmarks', async function(assert) {
    this.set('expected', moment.duration({ h: 8 }))

    await render(hbs`{{weekly-overview expected=expected}}`)

    assert.length(this.$('hr'), 12) // 11 (evens from 0 to 20) plus the expected
  })

  test('renders the days', async function(assert) {
    this.set('day', moment())
    this.set('expected', moment.duration({ h: 8 }))
    this.set('worktime', moment.duration({ h: 8 }))

    await render(hbs`
      {{#weekly-overview expected=expected}}
        {{weekly-overview-day day=day expected=expected worktime=worktime}}
      {{/weekly-overview}}
    `)

    assert.length(this.$('.bar'), 1)
  })
})
