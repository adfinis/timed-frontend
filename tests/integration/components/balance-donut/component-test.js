import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { find, render } from '@ember/test-helpers'
import moment from 'moment'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Component | balance donut', function(hooks) {
  setupRenderingTest(hooks)

  test('renders with a credit', async function(assert) {
    this.set('balance', {
      credit: 10,
      usedDays: 5
    })

    await render(hbs`{{balance-donut balance}}`)

    assert.dom('.donut-content').includesText('5 of 10')
    assert.dom('.donut-content').includesText('50%')

    assert.equal(
      find('.donut-segment').getAttribute('stroke-dasharray'),
      '50 50'
    )
  })

  test('renders without a credit', async function(assert) {
    this.set('balance', {
      credit: 0,
      usedDays: 3
    })

    await render(hbs`{{balance-donut balance}}`)

    assert.dom('.donut-content').includesText('3')
    assert.dom('.donut-content').doesNotIncludeText('0')

    assert.equal(
      find('.donut-segment').getAttribute('stroke-dasharray'),
      '100 0'
    )
  })

  test('renders with a smaller credit than used days', async function(assert) {
    this.set('balance', {
      credit: 10,
      usedDays: 20
    })

    await render(hbs`{{balance-donut balance}}`)

    assert.dom('.donut-content').includesText('20 of 10')
    assert.dom('.donut-content').includesText('200%')

    assert.equal(
      find('.donut-segment').getAttribute('stroke-dasharray'),
      '100 0'
    )
  })

  test('renders with a duration', async function(assert) {
    this.set('balance', {
      usedDuration: moment.duration({ h: 10 })
    })

    await render(hbs`{{balance-donut balance}}`)

    assert.dom('.donut-content').includesText('10:00')

    assert.equal(
      find('.donut-segment').getAttribute('stroke-dasharray'),
      '100 0'
    )
  })
})
