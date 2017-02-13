import { describe, it, beforeEach, afterEach }    from 'mocha'
import { expect }                                 from 'chai'
import startApp                                   from '../helpers/start-app'
import destroyApp                                 from '../helpers/destroy-app'
import { authenticateSession, invalidateSession } from 'timed/tests/helpers/ember-simple-auth'
import testSelector                               from 'ember-test-selectors'
import moment                                     from 'moment'

describe('Acceptance | index', function() {
  let application

  beforeEach(async function() {
    application = startApp()
    await authenticateSession(application)
  })

  afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  it('can select a day', async function() {
    await visit('')

    await click(testSelector('next'))

    let nextDay = moment().add(1, 'day')

    expect(currentURL()).to.equal(`/?day=${nextDay.format('YYYY-MM-DD')}`)

    await click(testSelector('today'))

    expect(currentURL()).to.equal('/')
  })

  describe('tracking', function() {
    beforeEach(function() {
      let customers = server.createList('customer', 10)

      customers.forEach((customer) => {
        let projects = server.createList('project', 2, { customer })

        projects.forEach((project) => {
          server.createList('task', 5, { project })
        })
      })
    })

    it('can stop tracking', async function() {
      let { schema: { tasks } } = server
      let allTasks = tasks.all().models
      server.create('activity', 'active', { day: moment(), task: allTasks[0] })

      await visit('/')

      await click(testSelector('record-stop'))

      expect(find(testSelector('record-stop'))).to.have.length(0)
    })

    it('can pause tracking', async function() {
      let { schema: { tasks } } = server
      let allTasks = tasks.all().models
      server.create('activity', 'active', { day: moment(), task: allTasks[0] })

      await visit('/')

      await click(testSelector('record-start'))

      expect(find(testSelector('record-stop'))).to.have.length(1)
    })

    it('can start tracking', async function() {
      await visit('/')

      await selectChoose(testSelector('tracking-customer'), '.ember-power-select-option:eq(-1)')
      await selectChoose(testSelector('tracking-project'), '.ember-power-select-option:eq(0)')
      await selectChoose(testSelector('tracking-task'), '.ember-power-select-option:eq(0)')
      await fillIn(`${testSelector('tracking-comment')} input`, 'test comment')

      await click(testSelector('record-start'))

      expect(find(testSelector('record-stop'))).to.have.length(1)
    })

    it('can continue tracking', async function() {
      let { schema: { tasks } } = server
      let allTasks = tasks.all().models
      server.create('activity', 'active', { day: moment(), task: allTasks[0] })

      let other = server.create('activity', { day: moment(), task: allTasks[0] })

      await visit('/')

      await click(testSelector('activity-row-id', other.id))

      expect(find(testSelector('record-stop'))).to.have.length(1)
    })
  })

  describe('attendances', function() {
    beforeEach(function() {
      server.create('attendance', 'morning', { day: moment() })
      server.create('attendance', 'afternoon', { day: moment() })
    })

    it('can delete attendances', async function() {
      await visit('/')

      expect(find('.slider-title')).to.have.length(2)

      await click('.slider-title .fa-trash')

      expect(find('.slider-title')).to.have.length(1)
    })

    it('can add attendances', async function() {
      await visit('/')

      expect(find('.slider-title')).to.have.length(2)

      await click('.btn:contains(New Attendance)')

      expect(find('.slider-title')).to.have.length(3)
    })

    it('can save attendances', async function() {
      await visit('/')

      expect(find('.slider-title')).to.have.length(2)

      await click('.noUi-connect')

      expect(find('.slider-title')).to.have.length(2)
    })
  })
})
