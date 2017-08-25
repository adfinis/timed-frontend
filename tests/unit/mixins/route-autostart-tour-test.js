import { expect } from 'chai'
import { describe, it } from 'mocha'
import EmberObject from 'ember-object'
import RouteAutostartTourMixin from 'timed/mixins/route-autostart-tour'

describe('Unit | Mixin | route autostart tour', function() {
  // Replace this with your real tests.
  it('works', function() {
    let RouteAutostartTourObject = EmberObject.extend(RouteAutostartTourMixin)
    let subject = RouteAutostartTourObject.create()
    expect(subject).to.be.ok
  })

  it('can get parent route name', function() {
    let RouteAutostartTourObject = EmberObject.extend(RouteAutostartTourMixin)
    let subject = RouteAutostartTourObject.create({ routeName: 'foo.bar.baz' })

    expect(subject._getParentRouteName()).to.equal('foo.bar')

    subject.set('routeName', 'foo')

    expect(subject._getParentRouteName()).to.equal('')
  })

  it('can check if a tour is wanted', function() {
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

    expect(subject._wantsTour('test', EmberObject.create({ tourDone: false })))
      .to.not.be.ok

    subject.set('media', {
      isMd: true,
      isLg: false,
      isXl: false
    })

    expect(subject._wantsTour('test', EmberObject.create({ tourDone: false })))
      .to.be.ok

    expect(subject._wantsTour('test', EmberObject.create({ tourDone: true })))
      .to.not.be.ok

    subject.set('autostartTour.done', [])

    expect(subject._wantsTour('test', EmberObject.create({ tourDone: false })))
      .to.be.ok

    subject.set('autostartTour.done', ['test'])

    expect(subject._wantsTour('test', EmberObject.create({ tourDone: false })))
      .to.not.be.ok
  })
})
