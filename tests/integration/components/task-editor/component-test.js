import { moduleForComponent, test } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

moduleForComponent('task-editor', 'Integration | Component | task editor', {
  integration: true
})

test('it renders', function(assert) {
  this.render(hbs`{{task-editor}}`)

  assert.notEqual(this.$().text().trim(), '')
})
