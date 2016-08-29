import Component from 'ember-component'
import moment    from 'moment'

export default Component.extend({
  align: null,

  actions: {
    setToday() {
      let date = moment()

      this.attrs['on-change'](date)
    },

    setPrevious() {
      let date = moment(this.get('current')).subtract(1, 'days')

      this.attrs['on-change'](date)
    },

    setNext() {
      let date = moment(this.get('current')).add(1, 'days')

      this.attrs['on-change'](date)
    }
  }
})
