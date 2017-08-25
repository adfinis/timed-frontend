import Mixin from 'ember-metal/mixin'
import RouteTourMixin from 'ember-site-tour/mixins/route-tour'
import { later, schedule } from 'ember-runloop'
import service from 'ember-service/inject'

/**
 * Mixin for a route which has a tour
 *
 * This mixin causes the tour to start after activating the route. It will stop
 * the tour of the parent route and start it again after leaving.
 *
 * @class RouteAutostartTourMixin
 * @extends Ember.Mixin
 * @uses EmberSiteTour.RouteTourMixin
 * @public
 */
export default Mixin.create(RouteTourMixin, {
  autostartTour: service('autostart-tour'),
  notify: service('notify'),

  /**
   * Get the route name of the parent route
   *
   * @method _getParentRouteName
   * @return {String} The parent route name
   * @private
   */
  _getParentRouteName() {
    let parts = this.get('routeName').split('.')

    parts.pop()

    return parts.join('.')
  },

  /**
   * Check whether the user wants a tour on this page
   *
   * A user wants a tour if:
   *   1. He is not on a mobile device
   *   2. He has not already completed or skipped all tours
   *   3. He has not already completed this certain tour
   *
   * @method _wantsTour
   * @param {String} routeName The name of the route to check
   * @return {Boolean} Whether the user wants a tour
   * @private
   */
  _wantsTour(routeName) {
    return (
      (this.get('media.isMd') ||
        this.get('media.isLg') ||
        this.get('media.isXl')) &&
      !this.modelFor('protected').get('tourDone') &&
      !this.get('autostartTour').get('done').includes(routeName)
    )
  },

  /**
   * Stop the parent tour if there is one
   *
   * @method stopParentTour
   * @public
   */
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

  /**
   * Start the parent tour if there is one
   *
   * @method startParentTour
   * @public
   */
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

  /**
   * Start the current tour
   *
   * @method startTour
   * @public
   */
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

  /**
   * Stop the current tour
   *
   * @method stopTour
   * @public
   */
  stopTour() {
    schedule('afterRender', this, () => {
      this.get('controller.tour').close()
    })
  },

  /**
   * Activate hook, start the tour and stop the parent route
   *
   * @method activate
   * @public
   */
  activate() {
    this._super(...arguments)

    this.stopParentTour()
    this.startTour()
  },

  /**
   * Deactivate hook, start the parent route
   *
   * @method deactivate
   * @public
   */
  deactivate() {
    this.startParentTour()

    this._super(...arguments)
  }
})
