import { authenticateSession, invalidateSession } from 'timed/tests/helpers/ember-simple-auth'
import { describe, it, beforeEach, afterEach }    from 'mocha'
import destroyApp                                 from '../helpers/destroy-app'
import { expect }                                 from 'chai'
import moment                                     from 'moment'
import startApp                                   from '../helpers/start-app'
import testSelector                               from 'ember-test-selectors'

describe('Acceptance | index', function() {
  let application

  beforeEach(async function() {
    application = startApp()

    let user = server.create('user')

    await authenticateSession(application, { 'user_id': user.id })
  })

  afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  it('can select a day', async function() {
    await visit('/')

    await click(testSelector('previous'))

    let lastDay = moment().subtract(1, 'day')

    expect(currentURL()).to.equal(`/?day=${lastDay.format('YYYY-MM-DD')}`)

    await click(testSelector('today'))

    expect(currentURL()).to.equal('/')
  })

  it('can start a activity by pressing enter', async function() {
    await visit('/')

    await triggerEvent('.page-content', 'keypress', { charCode: 13 })

    expect(find(testSelector('record-start'))).to.have.length(1)

    await triggerEvent(testSelector('tracking-comment'), 'keypress', { charCode: 22 })

    expect(find(testSelector('record-start'))).to.have.length(1)

    await triggerEvent(testSelector('tracking-comment'), 'keypress', { charCode: 13 })

    expect(find(testSelector('record-start'))).to.have.length(0)
  })

  it('can start a new activity', async function() {
    server.createList('task', 20)

    await visit('/')

    await taskSelect(testSelector('tracking-bar'))

    await fillIn(testSelector('tracking-comment'), 'Some Random Comment')

    expect(find(testSelector('record-start'))).to.have.length(1)

    await click(testSelector('record-start'))

    expect(find(testSelector('record-start'))).to.have.length(0)
    expect(find(testSelector('record-stop'))).to.have.length(1)
    expect(find(testSelector('record-stop')).parent().parent().hasClass('recording')).to.be.ok
  })

  it('can stop an active activity', async function() {
    let activity = server.create('activity', 'active')

    await visit('/')

    expect(find(testSelector('record-stop')).parent().parent().hasClass('recording')).to.be.ok
    expect(find(testSelector('record-stop'))).to.have.length(1)
    expect(find(`${testSelector('tracking-comment')} input`).val()).to.equal(activity.comment)

    await click(testSelector('record-stop'))

    expect(find(testSelector('record-start'))).to.have.length(1)
    expect(find(testSelector('record-stop'))).to.have.length(0)
    expect(find(testSelector('record-start')).parent().parent().hasClass('recording')).to.not.be.ok
    expect(find(`${testSelector('tracking-comment')} input`).val()).to.equal('')
  })

  it('can set the document title', async function() {
    server.create('activity', 'active')

    await visit('/')

    expect(document.title).to.match(/\d{2}:\d{2}:\d{2} \(.* > .* > .*\)/)

    await click(testSelector('record-stop'))

    expect(document.title).to.not.match(/\d{2}:\d{2}:\d{2} \(.* > .* > .*\)/)
  })

  it('can set the document title without task', async function() {
    let a = server.create('activity', 'active')
    a.update('task', null)

    await visit('/')

    expect(document.title).to.match(/\d{2}:\d{2}:\d{2} \(Unknown Task\)/)
  })
})
