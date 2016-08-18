import { moduleForComponent, test } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

moduleForComponent('record-button', 'Integration | Component | record button', {
  integration: true
})

test('it renders', function(assert) {
  this.render(hbs`{{record-button}}`)

  assert.notEqual(this.$().text().trim(), '')
})
