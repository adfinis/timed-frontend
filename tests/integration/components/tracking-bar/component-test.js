import { moduleForComponent, test } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

moduleForComponent('tracking-bar', 'Integration | Component | tracking bar', {
  integration: true
})

test('it renders', function(assert) {
  this.render(hbs`{{tracking-bar}}`)

  assert.notEqual(this.$().text().trim(), '')
})
