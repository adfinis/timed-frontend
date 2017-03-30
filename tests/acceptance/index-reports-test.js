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
    await authenticateSession(application)

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
    await selectChoose(`.modal ${testSelector('tracking-customer')}`, '.ember-power-select-option:eq(0)')
    await selectChoose(`.modal ${testSelector('tracking-project')}`, '.ember-power-select-option:eq(0)')
    await selectChoose(`.modal ${testSelector('tracking-task')}`, '.ember-power-select-option:eq(0)')

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

    expect(find(testSelector('report-row'))).to.have.length(6)

    expect(find(`${testSelector('report-row')}:last-of-type td:eq(1)`).text().trim()).to.equal('Test comment report')
    expect(find(`${testSelector('report-row')}:last-of-type td:eq(2)`).text().trim()).to.equal('03:30')
  })

  it('can add absence', async function() {
    server.createList('absence-type', 5)

    await visit('/reports')

    await click('button:contains(Add absence)')

    // select absence type
    await selectChoose(`${testSelector('absence-type')}`, '.ember-power-select-option:eq(0)')

    // open durationpicker
    await click(`${testSelector('absence-duration')} input`)

    // set duration to 04:45
    await click(`${testSelector('sy-durationpicker-inc-h')}`)
    await click(`${testSelector('sy-durationpicker-inc-h')}`)
    await click(`${testSelector('sy-durationpicker-inc-h')}`)
    await click(`${testSelector('sy-durationpicker-inc-h')}`)
    await click(`${testSelector('sy-durationpicker-inc-m')}`)
    await click(`${testSelector('sy-durationpicker-inc-m')}`)
    await click(`${testSelector('sy-durationpicker-inc-m')}`)

    // fill comment
    await fillIn(`${testSelector('absence-comment')} textarea`, 'Test comment absence')

    await click('button:contains(Save)')

    expect(find(testSelector('report-row'))).to.have.length(6)

    expect(find(`${testSelector('report-row')}:last-of-type td:eq(1)`).text().trim()).to.equal('Test comment absence')
    expect(find(`${testSelector('report-row')}:last-of-type td:eq(2)`).text().trim()).to.equal('04:45')

    expect(find(`${testSelector('report-row')}:last-of-type`).hasClass('is-absence')).to.be.ok
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
    let report = server.create('report', 'absence')

    await visit('/reports')

    expect(find(`${testSelector('report-row')}:last-of-type td:eq(1)`).text().trim()).to.equal(report.comment)

    await click(testSelector('report-row-id', report.id))

    await fillIn(`${testSelector('absence-comment')} textarea`, 'Test comment absence')

    await click('button:contains(Save)')

    expect(find(`${testSelector('report-row')}:last-of-type td:eq(1)`).text().trim()).to.equal('Test comment absence')
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
    let report = server.create('report', 'absence')

    await visit('/reports')

    expect(find(testSelector('report-row'))).to.have.length(6)

    expect(find(testSelector('report-row-id', report.id)).hasClass('is-absence')).to.be.ok

    await click(testSelector('report-row-id', report.id))

    await click('button:contains(Delete)')

    expect(find(testSelector('report-row'))).to.have.length(5)
  })
})
