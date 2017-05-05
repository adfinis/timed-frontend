import { authenticateSession, invalidateSession } from 'timed/tests/helpers/ember-simple-auth'
import { describe, it, beforeEach, afterEach }    from 'mocha'
import destroyApp                                 from '../helpers/destroy-app'
import { expect }                                 from 'chai'
import startApp                                   from '../helpers/start-app'
import testSelector                               from 'ember-test-selectors'

describe('Acceptance | index attendances', function() {
  let application

  beforeEach(async function() {
    application = startApp()

    let user = server.create('user')

    await authenticateSession(application, { 'user_id': user.id })

    server.create('attendance', 'morning')
    server.create('attendance', 'afternoon')
  })

  afterEach(async function() {
    await invalidateSession(application)
    destroyApp(application)
  })

  it('can visit /attendances', async function() {
    await visit('/attendances')

    expect(currentURL()).to.equal('/attendances')
  })

  it('can list attendances', async function() {
    await visit('/attendances')

    expect(find(testSelector('attendance-slider'))).to.have.length(2)
  })

  it('can save an attendances', async function() {
    await visit('/attendances')

    expect(find(testSelector('attendance-slider'))).to.have.length(2)

    await click(`${testSelector('attendance-slider-id', 1)} .noUi-draggable`)

    expect(find(testSelector('attendance-slider'))).to.have.length(2)
  })

  it('can add an attendance', async function() {
    await visit('/attendances')

    await click(testSelector('add-attendance'))

    expect(find(testSelector('attendance-slider'))).to.have.length(3)
  })

  it('can delete an attendance', async function() {
    await visit('/attendances')

    await click(`${testSelector('attendance-slider-id', 1)} ${testSelector('delete-attendance')}`)

    expect(find(testSelector('attendance-slider-id'), 1)).to.have.length(0)

    expect(find(testSelector('attendance-slider'))).to.have.length(1)
  })
})
