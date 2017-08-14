import {
  authenticateSession,
  invalidateSession
} from 'timed/tests/helpers/ember-simple-auth'
import { describe, it, beforeEach, afterEach } from 'mocha'
import destroyApp from '../helpers/destroy-app'
import { expect } from 'chai'
import startApp from '../helpers/start-app'
import testSelector from 'ember-test-selectors'
import { faker } from 'ember-cli-mirage'
import moment from 'moment'

describe('Acceptance | index reports', function() {
  let application

  beforeEach(async function() {
    application = startApp()

    let user = server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession(application, { user_id: user.id })

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

    // one row is for adding a new report
    expect(find(testSelector('report-row'))).to.have.length(6)
  })

  it('can add report', async function() {
    await visit('/reports')

    await taskSelect('.table--reports tr:last-child')

    await fillIn(
      `.table--reports tr:last-child ${testSelector('report-duration')}`,
      '03:30'
    )
    await fillIn(
      `.table--reports tr:last-child ${testSelector('report-comment')}`,
      'Test comment report'
    )

    await click(
      `.table--reports tr:last-child ${testSelector('report-review')}`
    )
    await click(
      `.table--reports tr:last-child ${testSelector('report-not-billable')}`
    )

    await click(`.table--reports tr:last-child ${testSelector('save-report')}`)

    expect(
      find(
        `${testSelector('report-row')}:nth-last-child(2) ${testSelector(
          'report-duration'
        )}`
      ).val()
    ).to.equal('03:30')
    expect(
      find(
        `${testSelector('report-row')}:nth-last-child(2) ${testSelector(
          'report-comment'
        )}`
      ).val()
    ).to.equal('Test comment report')
  })

  it('can edit report', async function() {
    let { id } = server.create('report')

    await visit('/reports')

    expect(
      find(
        `${testSelector('report-row-id', id)} ${testSelector('save-report')}`
      ).is(':disabled')
    ).to.be.ok

    await fillIn(
      `${testSelector('report-row-id', id)} ${testSelector('report-duration')}`,
      '00:15'
    )
    await fillIn(
      `${testSelector('report-row-id', id)} ${testSelector('report-comment')}`,
      'Testyy'
    )

    expect(
      find(
        `${testSelector('report-row-id', id)} ${testSelector('save-report')}`
      ).is(':disabled')
    ).to.not.be.ok

    await click(
      `${testSelector('report-row-id', id)} ${testSelector('save-report')}`
    )

    expect(
      find(
        `${testSelector('report-row-id', id)} ${testSelector('save-report')}`
      ).is(':disabled')
    ).to.be.ok

    expect(
      find(
        `${testSelector('report-row-id', id)} ${testSelector(
          'report-duration'
        )}`
      ).val()
    ).to.equal('00:15')
    expect(
      find(
        `${testSelector('report-row-id', id)} ${testSelector('report-comment')}`
      ).val()
    ).to.equal('Testyy')
  })

  it('can delete report', async function() {
    let { id } = server.create('report')

    await visit('/reports')

    expect(find(testSelector('report-row-id', id))).to.have.length(1)

    await click(
      `${testSelector('report-row-id', id)} ${testSelector('delete-report')}`
    )

    expect(find(testSelector('report-row-id', id))).to.have.length(0)
  })

  it('can submit report by pressing enter', async function() {
    await visit('/reports')

    expect(find(testSelector('report-row'))).to.have.length(6)

    await taskSelect('.table--reports tr:last-child')
    await fillIn(
      `.table--reports tr:last-child ${testSelector('report-duration')}`,
      '03:30'
    )
    await fillIn(
      `.table--reports tr:last-child ${testSelector('report-comment')}`,
      'Test comment report'
    )

    await triggerEvent(
      `.table--reports tr:last-child ${testSelector('report-comment')}`,
      'keypress',
      { which: 13, charCode: 13 }
    )

    expect(
      find(
        `${testSelector('report-row')}:nth-last-child(2) ${testSelector(
          'report-duration'
        )}`
      ).val()
    ).to.equal('03:30')
    expect(
      find(
        `${testSelector('report-row')}:nth-last-child(2) ${testSelector(
          'report-comment'
        )}`
      ).val()
    ).to.equal('Test comment report')

    expect(find(testSelector('report-row'))).to.have.length(7)
  })

  it('reloads absences after saving or deleting a report', async function() {
    server.loadFixtures('absence-types')

    let absence = server.create('absence')
    let report = server.create('report')

    server.get('/absences/:id', ({ absences }, { params: { id } }) => {
      let a = absences.find(id)

      a.comment = faker.lorem.sentence()

      return a
    })

    let { comment } = absence

    await visit('/reports')

    await click(testSelector('edit-absence'))
    expect(
      find(`${testSelector('edit-absence-form')} textarea`).val()
    ).to.equal(comment)
    await click(`${testSelector('edit-absence-form')} button.close`)

    await fillIn(
      `${testSelector('report-row-id', report.id)} ${testSelector(
        'report-comment'
      )}`,
      'test'
    )
    await click(
      `${testSelector('report-row-id', report.id)} ${testSelector(
        'save-report'
      )}`
    )

    await click(testSelector('edit-absence'))
    let c1 = find(`${testSelector('edit-absence-form')} textarea`).val()
    await click(`${testSelector('edit-absence-form')} button.close`)

    expect(c1).to.not.equal(comment)

    await click(
      `${testSelector('report-row-id', report.id)} ${testSelector(
        'delete-report'
      )}`
    )

    await click(testSelector('edit-absence'))
    let c2 = find(`${testSelector('edit-absence-form')} textarea`).val()
    await click(`${testSelector('edit-absence-form')} button.close`)

    expect(c2).to.not.equal(c1)
  })

  it('can reschedule reports', async function() {
    let tomorrow = moment().add(1, 'days').format('YYYY-MM-DD')

    await visit('/reports')
    expect(find(testSelector('report-row'))).to.have.length(6)

    await click(find('button:contains(reschedule)'))
    await click(find(`button[data-date="${tomorrow}"]`))
    await click(find('button:contains(save)'))

    expect(currentURL()).to.equal(`/reports?day=${tomorrow}`)
    expect(find(testSelector('report-row'))).to.have.length(6)
  })
})
