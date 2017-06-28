import Component         from 'ember-component'
import { oneWay }        from 'ember-computed-decorators'
import ReportValidations from 'timed/validations/report'
import Changeset         from 'ember-changeset'

const ENTER_CHAR_CODE = 13

const ReportRowComponent = Component.extend({
  tagName: 'tr',

  init() {
    this._super(...arguments)

    this.set('changeset', new Changeset(this.get('report'), ReportValidations))
  },

  'on-delete'() {},

  'on-save'() {},

  keyPress(e) {
    if (e.charCode === ENTER_CHAR_CODE && !e.target.classList.contains('tt-input')) {
      this.send('save')
    }
  },

  actions: {
    save() {
      this.get('on-save')(this.get('changeset'))
    },

    delete() {
      this.get('on-delete')(this.get('report'))
    }
  }
})

ReportRowComponent.reopenClass({
  positionalParams: [ 'report' ]
})

export default ReportRowComponent
