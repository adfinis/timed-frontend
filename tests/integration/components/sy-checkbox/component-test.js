import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | sy checkbox', function() {
  setupComponentTest('sy-checkbox', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#sy-checkbox}}
    //     template content
    //   {{/sy-checkbox}}
    // `);

    this.render(hbs`{{sy-checkbox}}`);
    expect(this.$()).to.have.length(1);
  });
});
