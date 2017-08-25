import Mixin from 'ember-metal/mixin'
import RouteTourMixin from 'ember-site-tour/mixins/route-tour'
import { later, schedule } from 'ember-runloop'
import service from 'ember-service/inject'

export default Mixin.create(RouteTourMixin, {
  autostartTour: service('autostart-tour'),
  notify: service('notify'),

  _getParentRouteName() {
    let parts = this.get('routeName').split('.')

    parts.pop()

    return parts.join('.')
  },

  _wantsTour(routeName) {
    return (
      !this.modelFor('protected').get('tourDone') &&
      !this.get('autostartTour').get('done').includes(routeName)
    )
  },

  stopParentTour() {
    let parentRouteName = this._getParentRouteName()

    if (!parentRouteName.length) {
      return
    }

    let tour = this.controllerFor(parentRouteName).get('tour')

    if (tour) {
      schedule('afterRender', this, () => {
        tour.close()
      })
    }
  },

  startParentTour() {
    let parentRouteName = this._getParentRouteName()

    if (!parentRouteName.length) {
      return
    }

    if (this._wantsTour(parentRouteName)) {
      let tour = this.controllerFor(parentRouteName).get('tour')

      if (tour) {
        schedule('afterRender', this, () => {
          tour.start()
        })
      }
    }
  },

  startTour() {
    if (this._wantsTour(this.get('routeName'))) {
      schedule('afterRender', this, () => {
        let tour = this.get('controller.tour')

        tour.on('tour.end', async e => {
          if (e.currentStep + 1 !== e.tour._steps.length) {
            return
          }

          let done = this.get('autostartTour').get('done')

          done.push(this.get('routeName'))

          this.get('autostartTour').set('done', done)

          if (this.get('autostartTour').allDone()) {
            try {
              let user = this.modelFor('protected')

              user.set('tourDone', true)

              await user.save()
              this.get('notify').info('Congratulations you completed the tour!')
            } catch (e) {
              /* istanbul ignore next */
              this.get('notify').error('Error while saving the user')
            }
          }
        })

        later(
          this,
          () => {
            tour.start()
          },
          100
        )
      })
    }
  },

  stopTour() {
    schedule('afterRender', this, () => {
      this.get('controller.tour').close()
    })
  },

  activate() {
    this._super(...arguments)

    this.stopParentTour()
    this.startTour()
  },

  resetController() {
    this.startParentTour()

    this._super(...arguments)
  }
})
