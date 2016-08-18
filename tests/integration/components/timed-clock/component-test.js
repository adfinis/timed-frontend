import { moduleForComponent, test } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

moduleForComponent('timed-clock', 'Integration | Component | timed clock', {
  integration: true
})

test('it renders', function(assert) {
  this.render(hbs`{{timed-clock}}`)

  assert.equal(this.$().text().trim(), '')
})
