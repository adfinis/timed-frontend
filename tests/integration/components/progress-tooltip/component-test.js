import { expect } from 'chai'
import { describe, it, beforeEach } from 'mocha'
import { setupRenderingTest } from 'ember-mocha'
import { find, render, waitFor } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage'
import EmberObject from '@ember/object'
import moment from 'moment'

describe('Integration | Component | progress tooltip', function() {
  const app = setupRenderingTest()
  setupMirage(app)

  beforeEach(function() {
    this.server.create('task')
  })

  it('renders', async function() {
    this.set(
      'model',
      EmberObject.create({
        id: 1,
        estimatedTime: moment.duration({ h: 50 }),
        constructor: EmberObject.create({
          modelName: 'project'
        })
      })
    )

    await render(hbs`
      <span id='target'></span>{{progress-tooltip target='#target' model=model visible=true}}
    `)

    expect(find('.progress-tooltip')).to.be.ok

    expect(
      find(
        '.progress-tooltip .time-info .time-info-durations p:nth-child(1)'
      ).innerHTML.trim()
    ).to.match(/^Spent: \d+h \d+m$/)

    expect(
      find(
        '.progress-tooltip .time-info .time-info-durations p:nth-child(2)'
      ).innerHTML.trim()
    ).to.equal('Estimate: 50h 0m')
  })

  it('renders with tasks', async function() {
    this.set(
      'model',
      EmberObject.create({
        id: 1,
        estimatedTime: moment.duration({ h: 100, m: 30 }),
        constructor: EmberObject.create({
          modelName: 'task'
        })
      })
    )

    await render(hbs`
      <span id='target'></span>{{progress-tooltip target='#target' model=model visible=true}}
    `)

    expect(find('.progress-tooltip')).to.be.ok

    expect(
      find(
        '.progress-tooltip .time-info .time-info-durations p:nth-child(1)'
      ).innerHTML.trim()
    ).to.match(/^Spent: \d+h \d+m$/)

    expect(
      find(
        '.progress-tooltip .time-info .time-info-durations p:nth-child(2)'
      ).innerHTML.trim()
    ).to.equal('Estimate: 100h 30m')
  })

  it('toggles correctly', async function() {
    this.set(
      'model',
      EmberObject.create({
        id: 1,
        estimatedTime: moment.duration({ h: 100, m: 30 }),
        constructor: EmberObject.create({
          modelName: 'task'
        })
      })
    )

    this.set('visible', false)

    await render(hbs`
      <span id='target'></span>{{progress-tooltip target='#target' model=model visible=visible}}
    `)

    expect(find('.progress-tooltip')).to.not.be.ok

    this.set('visible', true)

    await waitFor('.progress-tooltip')
    expect(find('.progress-tooltip')).to.be.ok
  })

  it('uses danger color when the factor is more than 1', async function() {
    this.set(
      'model',
      EmberObject.create({
        id: 1,
        estimatedTime: moment.duration({ h: 100 }),
        constructor: EmberObject.create({
          modelName: 'project'
        })
      })
    )

    this.server.get('/projects/:id', function({ projects }, request) {
      return {
        ...this.serialize(projects.find(request.params.id)),
        meta: {
          'spent-time': '4 05:00:00' // 101 hours
        }
      }
    })

    await render(hbs`
      <span id='target'></span>{{progress-tooltip target='#target' model=model visible=true}}
    `)

    expect(find('.progress-tooltip .badge--danger')).to.be.ok
    expect(find('.progress-tooltip .progress-bar.danger')).to.be.ok
  })

  it('uses warning color when the factor is 0.9 or more', async function() {
    this.set(
      'model',
      EmberObject.create({
        id: 1,
        estimatedTime: moment.duration({ h: 100 }),
        constructor: EmberObject.create({
          modelName: 'project'
        })
      })
    )

    this.server.get('/projects/:id', function({ projects }, request) {
      return {
        ...this.serialize(projects.find(request.params.id)),
        meta: {
          'spent-time': '3 18:00:00' // 90 hours
        }
      }
    })

    await render(hbs`
      <span id='target'></span>{{progress-tooltip target='#target' model=model visible=true}}
    `)

    expect(find('.progress-tooltip .badge--warning')).to.be.ok
    expect(find('.progress-tooltip .progress-bar.warning')).to.be.ok
  })
})
