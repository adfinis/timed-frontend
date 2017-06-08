import { authenticateSession, invalidateSession } from 'timed/tests/helpers/ember-simple-auth'
import { describe, it, beforeEach, afterEach }    from 'mocha'
import destroyApp                                 from '../helpers/destroy-app'
import { expect }                                 from 'chai'
import startApp                                   from '../helpers/start-app'
import testSelector                               from 'ember-test-selectors'
import { faker }                                  from 'ember-cli-mirage'

describe('Acceptance | index reports', function() {
  let application

  beforeEach(async function() {
    application = startApp()

    let user = server.create('user')

    await authenticateSession(application, { 'user_id': user.id })

    server.loadFixtures('absence-types')

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

    await click('button:contains(Add report)')

    // select task
    await taskSelect(testSelector('edit-report'))

    // open duration picker
    await click(`${testSelector('report-duration')} input`)

    // set duration to 03:30
    await click(`${testSelector('sy-durationpicker-inc-h')}`)
    await click(`${testSelector('sy-durationpicker-inc-h')}`)
    await click(`${testSelector('sy-durationpicker-inc-h')}`)
    await click(`${testSelector('sy-durationpicker-inc-m')}`)
    await click(`${testSelector('sy-durationpicker-inc-m')}`)

    // fill the remaining fields
    await fillIn(`${testSelector('report-comment')} textarea`, 'Test comment report')
    await click(`${testSelector('report-not-billable')} input`)
    await click(`${testSelector('report-review')} input`)

    // save
    await click('button:contains(Save)')

    // expect(find(testSelector('report-row'))).to.have.length(6)

    expect(find(`${testSelector('report-row')}:last-of-type td:eq(1)`).text().trim()).to.equal('Test comment report')
    expect(find(`${testSelector('report-row')}:last-of-type td:eq(2)`).text().trim()).to.equal('03:30')
  })

  it('can add absence', async function() {
    await visit('/reports')

    await click('button:contains(Add absence)')

    // select absence type
    await click(`${testSelector('absence-type')} .btn:eq(0)`)

    // fill comment
    await fillIn(`${testSelector('absence-comment')} textarea`, 'Test comment absence')

    await click('button:contains(Save)')

    expect(find(testSelector('absence-row'))).to.have.length(1)

    expect(find(`${testSelector('absence-row')} td:eq(1)`).text().trim()).to.equal('Test comment absence')
    expect(find(`${testSelector('absence-row')}`).hasClass('is-absence')).to.be.ok
  })

  it('can edit report', async function() {
    let report = server.create('report')

    await visit('/reports')

    expect(find(`${testSelector('report-row')}:last-of-type td:eq(1)`).text().trim()).to.equal(report.comment)

    await click(testSelector('report-row-id', report.id))

    await fillIn(`${testSelector('report-comment')} textarea`, 'Test comment report')

    await click('button:contains(Save)')

    expect(find(`${testSelector('report-row')}:last-of-type td:eq(1)`).text().trim()).to.equal('Test comment report')
  })

  it('can edit absence', async function() {
    let absence = server.create('absence')

    await visit('/reports')

    expect(find(`${testSelector('absence-row-id', absence.id)} td:eq(1)`).text().trim()).to.equal(absence.comment)

    await click(testSelector('absence-row-id', absence.id))

    await fillIn(`${testSelector('absence-comment')} textarea`, 'Test comment absence')

    await click('button:contains(Save)')

    expect(find(`${testSelector('absence-row-id', absence.id)} td:eq(1)`).text().trim()).to.equal('Test comment absence')
  })

  it('can delete report', async function() {
    let report = server.create('report')

    await visit('/reports')

    expect(find(testSelector('report-row'))).to.have.length(6)

    await click(testSelector('report-row-id', report.id))

    await click('button:contains(Delete)')

    expect(find(testSelector('report-row'))).to.have.length(5)
  })

  it('can delete absence', async function() {
    let absence = server.create('absence')

    await visit('/reports')

    expect(find(testSelector('absence-row'))).to.have.length(1)

    await click(testSelector('absence-row-id', absence.id))

    await click('button:contains(Delete)')

    expect(find(testSelector('absence-row'))).to.have.length(0)
  })

  it('reloads absences after saving or deleting a report', async function() {
    let absence = server.create('absence')
    let report  = server.create('report')

    server.get('/absences/:id', ({ absences }, { params: { id } }) => {
      let a = absences.find(id)

      a.comment = faker.lorem.sentence()

      return a
    })

    let { comment, id } = absence

    await visit('/reports')

    expect(find(`${testSelector('absence-row-id', id)} td:eq(1)`).text().trim()).to.equal(comment)

    await click(testSelector('report-row-id', report.id))
    await click('button:contains(Save)')

    let c1 = find(`${testSelector('absence-row-id', id)} td:eq(1)`).text().trim()

    expect(c1).to.not.equal(comment)

    await click(testSelector('report-row-id', report.id))
    await click('button:contains(Delete)')

    let c2 = find(`${testSelector('absence-row-id', id)} td:eq(1)`).text().trim()

    expect(c2).to.not.equal(c1)
  })
})
