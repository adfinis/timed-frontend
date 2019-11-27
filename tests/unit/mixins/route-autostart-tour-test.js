import { module, test } from 'qunit'
import EmberObject from '@ember/object'
import RouteAutostartTourMixin from 'timed/mixins/route-autostart-tour'

module('Unit | Mixin | route autostart tour', function() {
  // Replace this with your real tests.
  test('works', function(assert) {
    let RouteAutostartTourObject = EmberObject.extend(RouteAutostartTourMixin)
    let subject = RouteAutostartTourObject.create()
    assert.ok(subject)
  })

  test('can get parent route name', function(assert) {
    let RouteAutostartTourObject = EmberObject.extend(RouteAutostartTourMixin)
    let subject = RouteAutostartTourObject.create({ routeName: 'foo.bar.baz' })

    assert.equal(subject._getParentRouteName(), 'foo.bar')

    subject.set('routeName', 'foo')

    assert.equal(subject._getParentRouteName(), '')
  })

  test('can check if a tour is wanted', function(assert) {
    let RouteAutostartTourObject = EmberObject.extend(RouteAutostartTourMixin)
    let subject = RouteAutostartTourObject.create({
      routeName: 'foo.bar.baz',
      autostartTour: EmberObject.create({ done: [] })
    })

    subject.set('media', {
      isMd: false,
      isLg: false,
      isXl: false
    })

    assert.notOk(
      subject._wantsTour('test', EmberObject.create({ tourDone: false }))
    )

    subject.set('media', {
      isMd: true,
      isLg: false,
      isXl: false
    })

    assert.ok(
      subject._wantsTour('test', EmberObject.create({ tourDone: false }))
    )

    assert.notOk(
      subject._wantsTour('test', EmberObject.create({ tourDone: true }))
    )

    subject.set('autostartTour.done', [])

    assert.ok(
      subject._wantsTour('test', EmberObject.create({ tourDone: false }))
    )

    subject.set('autostartTour.done', ['test'])

    assert.notOk(
      subject._wantsTour('test', EmberObject.create({ tourDone: false }))
    )
  })
})
