import { authenticateSession, invalidateSession } from 'timed/tests/helpers/ember-simple-auth'
import { describe, it, beforeEach, afterEach }    from 'mocha'
import destroyApp                                 from '../helpers/destroy-app'
import { expect }                                 from 'chai'
import startApp                                   from '../helpers/start-app'
import testSelector                               from 'ember-test-selectors'

describe('Acceptance | index reports', function() {
  let application

  beforeEach(async function() {
    application = startApp()

    let user = server.create('user')

    await authenticateSession(application, { 'user_id': user.id })

    server.createList('report', 5)
  })

  afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  it('can visit /reports', async function() {
    await visit('/reports')

    expect(currentURL()).to.equal('/reports')
  })

  it('can list reports', async function() {
    await visit('/reports')

    expect(find(testSelector('report-row'))).to.have.length(5)
  })

  it('can add report', async function() {
    await visit('/reports')

    await click(testSelector('add-report'))

    await taskSelect('.table--reports tr:nth-last-child(2)')

    await fillIn(`.table--reports tr:nth-last-child(2) ${testSelector('report-duration')}`, '03:30')
    await fillIn(`.table--reports tr:nth-last-child(2) ${testSelector('report-comment')}`, 'Test comment report')

    await click(`.table--reports tr:nth-last-child(2) ${testSelector('report-review')}`)
    await click(`.table--reports tr:nth-last-child(2) ${testSelector('report-not-billable')}`)

    await click(`.table--reports tr:nth-last-child(2) ${testSelector('save-report')}`)

    expect(find(`${testSelector('report-row')}:nth-last-child(2) ${testSelector('report-duration')}`).val()).to.equal('03:30')
    expect(find(`${testSelector('report-row')}:nth-last-child(2) ${testSelector('report-comment')}`).val()).to.equal('Test comment report')
  })

  it('can edit report', async function() {
    let { id } = server.create('report')

    await visit('/reports')

    expect(find(`${testSelector('report-row-id', id)} ${testSelector('save-report')}`).is(':disabled')).to.be.ok

    await fillIn(`${testSelector('report-row-id', id)} ${testSelector('report-duration')}`, '00:15')
    await fillIn(`${testSelector('report-row-id', id)} ${testSelector('report-comment')}`, 'Testyy')

    expect(find(`${testSelector('report-row-id', id)} ${testSelector('save-report')}`).is(':disabled')).to.not.be.ok

    await click(`${testSelector('report-row-id', id)} ${testSelector('save-report')}`)

    expect(find(`${testSelector('report-row-id', id)} ${testSelector('save-report')}`).is(':disabled')).to.be.ok

    expect(find(`${testSelector('report-row-id', id)} ${testSelector('report-duration')}`).val()).to.equal('00:15')
    expect(find(`${testSelector('report-row-id', id)} ${testSelector('report-comment')}`).val()).to.equal('Testyy')
  })

  it('can delete report', async function() {
    let { id } = server.create('report')

    await visit('/reports')

    expect(find(testSelector('report-row-id', id))).to.have.length(1)

    await click(`${testSelector('report-row-id', id)} ${testSelector('delete-report')}`)

    expect(find(testSelector('report-row-id', id))).to.have.length(0)
  })
})
