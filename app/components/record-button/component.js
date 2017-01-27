import Component from 'ember-component'
import moment from 'moment'

export default Component.extend({
  classNameBindings: [ 'recording', 'paused', 'ready' ],

  startTime: moment(),
  recording: false,
  paused: false,
  ready: false,

  actions: {
    startOrPause() {
      if (this.get('recording')) {
        return this.sendAction('pause')
      }

      return this.sendAction('start')
    },

    stop() {
      this.sendAction('stop')
    }
  }
})
