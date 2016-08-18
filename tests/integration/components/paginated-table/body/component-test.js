import { moduleForComponent, test } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

moduleForComponent('paginated-table/body', 'Integration | Component | paginated table/body', {
  integration: true
})

test('it renders', function(assert) {
  this.render(hbs`{{paginated-table/body}}`)

  assert.notEqual(this.$().text().trim(), '')
})
