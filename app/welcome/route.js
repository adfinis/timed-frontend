import Route from 'ember-route'
import service from 'ember-service/inject'

export default Route.extend({
  autostartTour: service('autostart-tour'),

  notify: service('notify'),

  beforeModel() {
    this._super(...arguments)

    if (this.modelFor('protected').get('tourDone')) {
      return this.replaceWith('index.activities')
    }
  },

  actions: {
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

    skipTour() {
      this.get('autostartTour').setDone(this.get('autostartTour.tours'))

      this.transitionTo('index.activities')
    },

    startTour() {
      this.get('autostartTour').set('done', [])

      this.transitionTo('index.activities')
    }
  }
})
