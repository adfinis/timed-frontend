import { moduleForComponent, test } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

moduleForComponent('paginated-table', 'Integration | Component | paginated table', {
  integration: true
})

test('it renders', function(assert) {
  this.render(hbs`{{paginated-table}}`)

  assert.notEqual(this.$().text().trim(), '')
})
