import Route from 'ember-route'
import service from 'ember-service/inject'

export default Route.extend({
  autostartTour: service('autostart-tour'),
  notify: service('notify'),

  /**
   * Before model hook, redirect to index route if the tour is already
   * completed or the screen is too small for the tour.
   *
   * @method beforeModel
   * @public
   */
  beforeModel() {
    this._super(...arguments)

    if (
      this.modelFor('protected').get('tourDone') ||
      this.get('media.isMo') ||
      this.get('media.isXs') ||
      this.get('media.isSm')
    ) {
      this.replaceWith('index.activities')
    }
  },

  actions: {
    /**
     * Decline the tour
     *
     * This sets the tour done attribute on the user
     *
     * @method declineTour
     * @public
     */
    async declineTour() {
      try {
        let user = this.modelFor('protected')

        user.set('tourDone', true)

        await user.save()
        this.transitionTo('index.activities')
      } catch (e) {
        /* istanbul ignore next */
        this.get('notify').error('Error while saving the user')
      }
    },

    /**
     * Skip the tour for now
     *
     * This only sets the tours in the localstorage as completed
     *
     * @method skipTour
     * @public
     */
    skipTour() {
      this.get('autostartTour').set('done', this.get('autostartTour.tours'))

      this.transitionTo('index.activities')
    },

    /**
     * Start the tour
     *
     * @method startTour
     * @public
     */
    startTour() {
      this.get('autostartTour').set('done', [])

      this.transitionTo('index.activities')
    }
  }
})
