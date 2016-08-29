import { moduleForComponent, test } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'
import moment from 'moment'

moduleForComponent('date-navigation', 'Integration | Component | date navigation', {
  integration: true
})

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value')
  // Handle any actions with this.on('myAction', function(val) { ... })

  this.render(hbs`{{date-navigation}}`)

  assert.equal(this.$().text().trim(), moment().format('ddd, ll'))
})
