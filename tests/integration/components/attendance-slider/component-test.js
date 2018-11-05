import { click, find } from '@ember/test-helpers'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import EmberObject from '@ember/object'
import moment from 'moment'

const ATTENDANCE = EmberObject.create({
  from: moment({ h: 8, m: 0, s: 0, ms: 0 }),
  to: moment({ h: 8, m: 0, s: 0, ms: 0 })
})

describe('Integration | Component | attendance slider', function() {
  setupComponentTest('attendance-slider', {
    integration: true
  })

  it('renders', function() {
    this.set('attendance', ATTENDANCE)

    this.render(hbs`
      {{attendance-slider attendance=attendance}}
    `)

    expect(this.$('.noUi-connect')).to.be.ok
  })

  it('can delete', async function() {
    this.set('attendance', ATTENDANCE)

    this.on('delete', attendance => {
      expect(attendance).to.be.ok
    })

    this.render(hbs`
      {{attendance-slider
        attendance = attendance
        on-delete  = (action 'delete')
      }}
    `)

    await click('.fa-trash')
  })

  it('can handle attendances until 00:00', function() {
    this.set(
      'attendance',
      EmberObject.create({
        from: moment({ h: 0, m: 0, s: 0 }),
        to: moment({ h: 0, m: 0, s: 0 })
      })
    )

    this.render(hbs`
      {{attendance-slider attendance=attendance}}
    `)

    expect(find('span').textContent.trim()).to.equal('24:00')
  })
})
