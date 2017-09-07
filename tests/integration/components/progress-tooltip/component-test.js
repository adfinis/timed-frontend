import { expect } from 'chai'
import { describe, it, beforeEach, afterEach } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import { startMirage } from 'timed/initializers/ember-cli-mirage'
import EmberObject from 'ember-object'
import wait from 'ember-test-helpers/wait'
import moment from 'moment'
import $ from 'jquery'

describe('Integration | Component | progress tooltip', function() {
  setupComponentTest('progress-tooltip', {
    integration: true
  })

  beforeEach(function() {
    this.server = startMirage()

    this.server.create('task')
  })

  afterEach(function() {
    this.server.shutdown()
  })

  it('renders', function() {
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

    this.render(hbs`
      <span id='target'></span>{{progress-tooltip target='#target' model=model visible=true}}
    `)

    expect($('.progress-tooltip')).to.have.length(0)

    return wait().then(() => {
      expect($('.progress-tooltip')).to.have.length(1)

      expect(
        $('.progress-tooltip .time-info .time-info-durations p:nth-child(1)')
          .text()
          .trim()
      ).to.match(/^Spent: \d+h \d+m$/)

      expect(
        $('.progress-tooltip .time-info .time-info-durations p:nth-child(2)')
          .text()
          .trim()
      ).to.equal('Estimate: 50h 0m')
    })
  })

  it('renders with tasks', function() {
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

    this.render(hbs`
      <span id='target'></span>{{progress-tooltip target='#target' model=model visible=true}}
    `)

    expect($('.progress-tooltip')).to.have.length(0)

    return wait().then(() => {
      expect($('.progress-tooltip')).to.have.length(1)

      expect(
        $('.progress-tooltip .time-info .time-info-durations p:nth-child(1)')
          .text()
          .trim()
      ).to.match(/^Spent: \d+h \d+m$/)

      expect(
        $('.progress-tooltip .time-info .time-info-durations p:nth-child(2)')
          .text()
          .trim()
      ).to.equal('Estimate: 100h 30m')
    })
  })

  it('toggles correctly', function() {
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

    this.render(hbs`
      <span id='target'></span>{{progress-tooltip target='#target' model=model visible=visible}}
    `)

    expect($('.progress-tooltip')).to.have.length(0)

    this.set('visible', true)

    return wait().then(() => {
      expect($('.progress-tooltip')).to.have.length(1)
    })
  })

  it('uses danger color when the factor is more than 1', function() {
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

    this.render(hbs`
      <span id='target'></span>{{progress-tooltip target='#target' model=model visible=true}}
    `)

    return wait().then(() => {
      expect($('.progress-tooltip .badge--danger')).to.have.length(1)
      expect($('.progress-tooltip .progress-bar.danger')).to.have.length(1)
    })
  })

  it('uses warning color when the factor is 0.9 or more', function() {
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

    this.render(hbs`
      <span id='target'></span>{{progress-tooltip target='#target' model=model visible=true}}
    `)

    return wait().then(() => {
      expect($('.progress-tooltip .badge--warning')).to.have.length(1)
      expect($('.progress-tooltip .progress-bar.warning')).to.have.length(1)
    })
  })
})
