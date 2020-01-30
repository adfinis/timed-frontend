import { currentURL, visit } from '@ember/test-helpers'
import { authenticateSession } from 'ember-simple-auth/test-support'
import { module, test } from 'qunit'
import { setupApplicationTest } from 'ember-qunit'
import { setupMirage } from 'ember-cli-mirage/test-support'

module('Acceptance | notfound', function(hooks) {
  setupApplicationTest(hooks)
  setupMirage(hooks)

  test('redirects to login for undefined routes if not logged in', async function(
    assert
  ) {
    await visit('/thiswillneverbeavalidrouteurl')

    assert.equal(currentURL(), '/login')
  })

  test('displays a 404 page for undefined routes if logged in', async function(
    assert
  ) {
    let user = this.server.create('user')

    // eslint-disable-next-line camelcase
    await authenticateSession({ user_id: user.id })

    await visit('/thiswillneverbeavalidrouteurl')

    assert.dom('[data-test-notfound]').exists({ count: 1 })
  })
})
