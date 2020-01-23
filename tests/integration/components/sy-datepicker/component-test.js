import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'
import moment from 'moment'
import { find, triggerEvent, click, render } from '@ember/test-helpers'
import { clickTrigger } from 'ember-basic-dropdown/test-support/helpers'

module('Integration | Component | sy datepicker', function(hooks) {
  setupRenderingTest(hooks)

  test('renders', async function(assert) {
    this.set('value', moment())

    await render(
      hbs`{{sy-datepicker value=value on-change=(action (mut value))}}`
    )

    assert.dom('input').hasValue(moment().format('DD.MM.YYYY'))
  })

  test('toggles the calendar on click of the input', async function(assert) {
    this.set('value', moment())

    await render(
      hbs`{{sy-datepicker value=value on-change=(action (mut value))}}`
    )

    assert.dom('.sy-datepicker').doesNotExist()

    await clickTrigger()

    assert.dom('.sy-datepicker').exists()
  })

  test('validates the input', async function(assert) {
    this.set('value', null)

    await render(
      hbs`{{sy-datepicker value=value on-change=(action (mut value))}}`
    )

    assert.ok(find('input').validity.valid)

    find('input').value = '20.20.20'
    await triggerEvent('input', 'input')

    assert.notOk(find('input').validity.valid)

    find('input').value = '20.12.20'
    await triggerEvent('input', 'input')

    assert.ok(find('input').validity.valid)
  })

  test('changes value on change (input)', async function(assert) {
    this.set('value', moment())

    await render(
      hbs`{{sy-datepicker value=value on-change=(action (mut value))}}`
    )

    find('input').value = '1.2.2018'
    await triggerEvent('input', 'change')

    assert.equal(this.get('value').format('YYYY-MM-DD'), '2018-02-01')

    find('input').value = ''
    await triggerEvent('input', 'change')

    assert.equal(this.get('value'), null)

    find('input').value = 'somewrongthing'
    await triggerEvent('input', 'change')

    // value stays unchanged
    assert.equal(this.get('value'), null)
  })

  test('changes value on selection', async function(assert) {
    this.set('value', moment())

    await render(
      hbs`{{sy-datepicker value=value on-change=(action (mut value))}}`
    )

    await clickTrigger()
    await click(
      '.ember-power-calendar-day-grid .ember-power-calendar-row:last-child .ember-power-calendar-day:last-child'
    )

    let expected = moment()
      .endOf('month')
      .endOf('week')

    assert.ok(this.get('value').isSame(expected, 'day'))
  })

  test('toggles the calendar on focus and blur of the input', async function(
    assert
  ) {
    this.set('value', moment())

    await render(
      hbs`{{sy-datepicker value=value on-change=(action (mut value))}}`
    )

    assert.dom('.sy-datepicker').doesNotExist()

    // show if focus is on input
    await triggerEvent('input', 'focus')
    assert.dom('.sy-datepicker').exists()

    // do not hide if focus changed into the picker
    await triggerEvent('input', 'blur', {
      relatedTarget: find('.sy-datepicker')
    })
    assert.dom('.sy-datepicker').exists()

    // hide if focus changed into another element
    await triggerEvent('input', 'blur')
    assert.dom('.sy-datepicker').doesNotExist()
  })
})
